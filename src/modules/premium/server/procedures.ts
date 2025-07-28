import {createTRPCRouter,protectedProcedure } from "@/trpc/init";
import { polarClient } from "@/lib/polar";
import {agents,meetings} from "@/db/schema";
import { db } from "@/db";
import { eq , count} from "drizzle-orm";



// the id will be same as the polar external id 
export const premiumRouter = createTRPCRouter({


// listing the products(all sub plans) from polar db in array 
    getProducts:protectedProcedure.query(async () => {
        const products=await polarClient.products.list({
            isArchived: false,
            isRecurring: true,
            sorting:["price_amount"]
        })
        return products.result.items; //array
    }),


    getCurrentSubscription:protectedProcedure.query(async ({ctx}) => {
        const customer=await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id,
        })
        const subscription=customer.activeSubscriptions[0];
        if(!subscription) {
            return null;
        }

        // Basically we are getting the product which is the subscription plan only , also the user can have only one subscription at a time so we are getting the first one
        const product=await polarClient.products.get({id:subscription.productId});
        // Prouduct is the subscription plan only as we are using the product as a subscription plan

        return product;
    }
),



// as polar external id is same as the userid 
    getFreeUsage:protectedProcedure.query(async ({ctx}) => {
        const customer=await polarClient.customers.getStateExternal({
            externalId: ctx.auth.user.id,
        })

        const subscription=customer.activeSubscriptions[0]; 
        // its index is 0 because we are only allowing one subscription at a time so it will always be 0

        if(subscription) {
            return null;
        }

        // counting the meeeting and agents for the user for the logged in user  

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

// This freeUsage procedure will return the COUNT of meetings and agents for the user so that we can compare 
