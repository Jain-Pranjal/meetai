import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { agentInsertSchema } from "../schema";
import { z } from "zod";
import { eq, sql , getTableColumns, and, ilike,desc,count} from "drizzle-orm";
import { DEFAULT_PAGE,MIN_PAGE_SIZE,MAX_PAGE_SIZE,DEFAULT_PAGE_SIZE } from "@/constants";

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
                ...getTableColumns(agents),
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
    getOne:protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const [existingAgent] = await db.select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`5`
        }).from(agents)
        .where(eq(agents.id, input.id));
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
        .returning();
        return createdAgent;
    })
});


// we need to pass array as drizzle expects an array of objects to insert