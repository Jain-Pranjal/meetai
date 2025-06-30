import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { agentInsertSchema, agentUpdateSchema } from "../schema";
import { z } from "zod";
import { eq, sql , getTableColumns, and, ilike,desc,count} from "drizzle-orm";
import { DEFAULT_PAGE,MIN_PAGE_SIZE,MAX_PAGE_SIZE,DEFAULT_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";

// this is specifically the procedure for the agents module
// as u can see we are also setting the type of the input and output using zod schema that the api will accept ensuring type safety and validation


export const agentsRouter = createTRPCRouter({

    getMany:protectedProcedure.input(
        z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
        }))

        .query(async({ctx,input})=>{
            const { page, pageSize, search } = input;

            const data = await db.select({
                ...getTableColumns(agents), //to preserve all the columns from the agents table
                meetingCount: sql<number>`5`
            }).from(agents)
            .where(and(eq(agents.userId, ctx.auth.session.userId),// filtering by userId to ensure only agents created by the user are returned
            search ? ilike(agents.name, `%${search}%`):undefined))
            .orderBy(desc(agents.createdAt),desc(agents.id))
            .limit(pageSize)
            .offset((page - 1) * pageSize); 


            const [total] = await db
            .select({ count: count()})
            .from(agents)
            .where(and(eq(agents.userId, ctx.auth.session.userId),
            search ? ilike(agents.name, `%${search}%`):undefined));

            const totalPages = Math.ceil(total.count / pageSize);

// aliasing the count and total count

            return {
                items: data,
                totalCount: total.count,
                totalPages,
            }

    }),


    // fetch a single agent by id
    getOne:protectedProcedure.input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
        const [existingAgent] = await db.select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`5`
        }).from(agents)
        .where(and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.session.userId))
        );

        if (!existingAgent) {
            throw new TRPCError({code: "NOT_FOUND", message: "Agent not found"});
        }
        
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
            userId: auth.user.id,  //setting the userId from the auth context into the db 
        })
        .returning();   //This method tells your database adapter to return the rows that were inserted
        return createdAgent;
    }),


    remove:protectedProcedure.input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
        const { id } = input;
        const [removedAgent] = await db.delete(agents)
        .where(and(eq(agents.id, id), eq(agents.userId, ctx.auth.session.userId)))
        .returning();

        if (!removedAgent) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
        }

        return removedAgent;
    }),


    update:protectedProcedure.input(agentUpdateSchema
    ).mutation(async ({ input, ctx }) => {
        const { id, name, instructions } = input;

        const [updatedAgent] = await db.update(agents)
        .set({
            name,
            instructions
        })
        .where(and(eq(agents.id, id), eq(agents.userId, ctx.auth.session.userId)))
        .returning();

        if (!updatedAgent) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
        }

        return updatedAgent;
    })




});






// we need to pass array as drizzle expects an array of objects to insert