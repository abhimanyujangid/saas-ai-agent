import { db } from "@/db";
import z from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";

import { agents } from "@/db/schema";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";

import { agentInsertSchema, agentUpdateSchema } from "../schemas";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants/constants";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({

  update: protectedProcedure
    .input(agentUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, name, instructions } = input;

      const [updatedAgent] = await db
        .update(agents)
        .set({
          name,
          instruction: instructions,
        })
        .where(
          and(
            eq(agents.id, id),
            eq(agents.userId, ctx.auth.user.id),
          )
        )
        .returning();

      if (!updatedAgent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Agent with id ${id} not found`,
        });
      }

      return updatedAgent;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const  [ removeAgent ] = await db
        .delete(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id),
          )
        )
        .returning();

        if (!removeAgent) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Agent with id ${input.id} not found`,
          });
        }

        return removeAgent;
    }),
 
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),

          // Add any additional fields you want to select
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id),
          )
        );

        if(!existingAgent) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Agent with id ${input.id} not found`,
          });
        }

      return existingAgent;
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
          ...getTableColumns(agents),
          // Add any additional fields you want to select
          meetingCount: sql<number>`9`,
        })
        .from(agents)
        .where(
            and(
                eq(agents.userId, ctx.auth.user.id), 
                search ? ilike(agents.name, `%${search}%`) : undefined
            )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

        const [totalCount] = await db
        .select({ count: count() })
        .from(agents)
        .where(
            and(
                eq(agents.userId, ctx.auth.user.id),
                search ? ilike(agents.name, `%${search}%`) : undefined
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

  create: protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      // const { name , instructions } = input;
      // const { auth } = ctx;

      const [createAgent] = await db
        .insert(agents)
        .values({
          name: input.name,
          instruction: input.instructions,
          userId: ctx.auth.user.id, // Assuming ctx.auth.user.id is available
        })
        .returning();
      return createAgent;
    }),
});
