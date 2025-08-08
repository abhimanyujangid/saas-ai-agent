import { db } from "@/db";
import z from "zod";
import { and, count, desc, eq, getTableColumns, ilike , sql} from "drizzle-orm";

import { agents, meetings } from "@/db/schema";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants/constants";
import { TRPCError } from "@trpc/server";

export const meetingsRouter = createTRPCRouter({

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(agents),
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId, ctx.auth.user.id),
          )
        );

        if(!existingMeeting) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Meeting with id ${input.id} not found`,
          });
        }

      return existingMeeting;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
          // You can add any input validation schema here if needed
          page: z.number().default(DEFAULT_PAGE),
          pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
          search: z.string().optional().nullish(),
        }))
    .query(async ({ ctx, input }) => {
        const { page, pageSize, search } = input;  
      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (meetings."ended_at" - meetings."started_at"))`.as("duration"),

        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
            and(
                eq(meetings.userId, ctx.auth.user.id), 
                search ? ilike(meetings.name, `%${search}%`) : undefined
            )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

        const [totalCount] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
            and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined
            )
        );

        const totalPages = Math.ceil(totalCount.count / pageSize);
       
      return {
        items: data,
        totalCount: Number(totalCount.count ?? 0),
        totalPages,
        currentPage: page,
      }
    }),  
});
