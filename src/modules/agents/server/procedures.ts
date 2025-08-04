import { db } from "@/db";
import z from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";

import { agents } from "@/db/schema";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";

import { agentInsertSchema } from "../schemas";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants/constants";

export const agentsRouter = createTRPCRouter({
 
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgent] = await db
        .select({
          ...getTableColumns(agents),

          // Add any additional fields you want to select
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(eq(agents.id, input.id));

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
