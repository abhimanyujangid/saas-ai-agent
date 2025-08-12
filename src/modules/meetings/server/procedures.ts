import { db } from "@/db";
import z from "zod";
import { and, count, desc, eq, getTableColumns, ilike , sql} from "drizzle-orm";

import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants/constants";
import { TRPCError } from "@trpc/server";

// Schemas
import { meetingInsertSchema, meetingUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { stat } from "fs";

export const meetingsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (meetings."ended_at" - meetings."started_at"))`.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
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
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().optional().nullish(),
        agentId: z.string().nullish(), 
        status: z.enum([
          MeetingStatus.COMPLETED,
          MeetingStatus.PROCESSING,
          MeetingStatus.UPCOMING,
          MeetingStatus.ACTIVE,
          MeetingStatus.CANCELLED,
        ]).optional().nullish()
      })
    )
    .query(async ({ ctx, input,  }) => {
      const { page, pageSize, search, agentId, status  } = input;
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
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId && agentId.trim() !== '' ? eq(meetings.agentId, agentId) : undefined
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
            search ? ilike(meetings.name, `%${search}%`) : undefined,
              status ? eq(meetings.status, status) : undefined,
            agentId && agentId.trim() !== '' ? eq(meetings.agentId, agentId) : undefined
          )
        );

      const totalPages = Math.ceil(totalCount.count / pageSize);

      return {
        items: data,
        totalCount: Number(totalCount.count ?? 0),
        totalPages,
        currentPage: page,
      };
    }),
  create: protectedProcedure
    .input(meetingInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createMeeting] = await db
        .insert(meetings)
        .values({
          name: input.name,
          agentId: input.agentId,
          userId: ctx.auth.user.id, // Assuming ctx.auth.user.id is available
        })
        .returning();

      // TODO : create stream call , upsert stream user
      return createMeeting;
    }),

  update: protectedProcedure
    .input(meetingUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, name, agentId } = input;

      const [updatedMeeting] = await db
        .update(meetings)
        .set({
          name,
          agentId,
        })
        .where(and(eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)))
        .returning();

      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Meeting with id ${id} not found`,
        });
      }

      return updatedMeeting;
    }),
    remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const [deletedMeeting] = await db
        .delete(meetings)
        .where(and(eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)))
        .returning();

      if (!deletedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Meeting with id ${id} not found`,
        });
      }

      return deletedMeeting;
    }),
});
