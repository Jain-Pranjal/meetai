import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { agentInsertSchema } from "../schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

// this is specifically the procedure for the agents module
// as u can see we are also setting the type of the input and output using zod schema that the api will accept ensuring type safety and validation


export const agentsRouter = createTRPCRouter({
    getMany:protectedProcedure.query(async()=>{
        const data=await db.select().from(agents);
        return data;
    }),


    // fetch a single agent by id
    getOne:protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, input.id));
        return existingAgent;
    }),


// the zod schema is used to validate the input data for creating an agent

    create:protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({ input,ctx }) => {
        const { auth } = ctx; 
        const [createdAgent] = await db.insert(agents)
        .values({
            ...input,
            userId: auth.user.id,  //setting the userId from the auth context
        })
        .returning();
        return createdAgent;
    })
});


// we need to pass array as drizzle expects an array of objects to insert
