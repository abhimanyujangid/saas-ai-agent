import { db } from "@/db";
import z from "zod";
import { eq } from "drizzle-orm";



import { agents } from "@/db/schema";
import { 
    createTRPCRouter,
    baseProcedure,
    protectedProcedure
} from "@/trpc/init";



import { agentSchema } from "../schemas";

export const agentsRouter = createTRPCRouter({
    // Todo : change this 'getMMany' to use ' proctedeProcedure' instead of 'baseProcedure'

    getone: baseProcedure
    .input(z.object({ id: z.string() })).query(async({ input })=>{
        const [existingAgent] = await db.select()
        .from(agents)
        .where(eq(agents.id, input.id))

        return existingAgent;
    }),

    getMany: protectedProcedure.query(
        async()=>{
            const data = await db.select().from(agents);
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve(data);
                }, 3000); // Simulate a delay of 1 second
            });
            return data;
        }
    ),

    create: protectedProcedure
    .input(agentSchema)
    .mutation(async ({ input, ctx }) => {
        // const { name , instructions } = input;
        // const { auth } = ctx;

        const [createAgent] = await db.insert(agents)
            .values({
                name: input.name,
                instruction: input.instructions,
                userId: ctx.auth.user.id, // Assuming ctx.auth.user.id is available
            })
            .returning();
        return createAgent;
    }),
})