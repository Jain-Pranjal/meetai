import {createTRPCRouter,protectedProcedure } from "@/trpc/init";
import { polarClient } from "@/lib/polar";
import {agents,meetings} from "@/db/schema";
import { db } from "@/db";
import { eq, and , count} from "drizzle-orm";



// the id will be same as the polar external id 
export const premiumRouter = createTRPCRouter({





    getProducts:protectedProcedure.query(async ({ctx}) => {
        const products=await polarClient.products.list({
            isArchived: false,
            isRecurring: true,
            sorting:["price_amount"]
        })
    }),

    getCurrentSubscription:protectedProcedure.query(async ({ctx}) => {
        const customer=await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id,
        })
        const subscription=customer.activeSubscriptions[0];
        if(!subscription) {
            return null;
        }

        const product=await polarClient.products.get({id:subscription.productId});

        return product;
    }
),




    getFreeUsage:protectedProcedure.query(async ({ctx}) => {
        const customer=await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id,
        })

        const subscription=customer.activeSubscriptions[0];

        if(subscription) {
            return null;
        }

        // counting the meeeting 

        const [userMeetings]=await db
        .select({
            count: count(meetings.id)
        })
        .from(meetings)
        .where(eq(meetings.userId, ctx.auth.user.id))

        const [userAgents]= await db
        .select({
            count: count(agents.id)
        })
        .from(agents)
        .where(eq(agents.userId, ctx.auth.user.id))

        return {
            meetingsCount: userMeetings.count,
            agentsCount: userAgents.count,
        }

    })
})