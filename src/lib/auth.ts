// Better Auth server instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { FullSchema } from "@/db/schema"; // your schema definition
import {polar,checkout,portal} from "@polar-sh/better-auth" 
import { polarClient } from "./polar";

export const auth = betterAuth({
    socialProviders: { 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string,  
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        } ,
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            prompt: "select_account", 
        }, 

    }, 

    plugins:[
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use:[
                checkout({
                    authenticatedUsersOnly: true,
                    successUrl:"/upgrade"
                }),
                portal()
            ]
        }),
    ],

    emailAndPassword: {  
        enabled: true
    },

    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: FullSchema, 
    })
});