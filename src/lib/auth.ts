// Better Auth server instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { FullSchema } from "@/db/schema"; // your schema definition
import {polar,checkout,portal} from "@polar-sh/better-auth" 
import { polarClient } from "./polar";
import VerifyEmail from "@/components/emails/verify-email";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import { resend } from "@/lib/resend"; 
import { oneTap } from "better-auth/plugins"; 
import { haveIBeenPwned } from "better-auth/plugins"



export const auth = betterAuth({

     emailVerification: {
         sendVerificationEmail: async ({ user, url }) => {
            await resend.emails.send({
               from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: user.email,
                subject: "Verify your email",
                react: VerifyEmail({ username: user.name, verifyUrl: url }),

            });
        },
        sendOnSignUp: true,
        expiresIn:3600, // 1 hour in seconds

    },



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
            createCustomerOnSignUp: true, //automatically creates Polar customers when users sign up
            use:[
                checkout({
                    authenticatedUsersOnly: true,
                    successUrl:"/upgrade"
                }),
                portal()
            ]
        }),

        oneTap(), 
        // by default disableSignup is false 
        // Setting disableSignUp: true on the plugin will disable new account creation: One Tap will only allow sign‑in for existing users, and return an error for unknown emails

        haveIBeenPwned({customPasswordCompromisedMessage: "Your password has been compromised in a data breach. Please choose a different password."})
        // this plugin will check if the email has been compromised in a data breach
    ],

    emailAndPassword: {  
        enabled: true,
        requireEmailVerification: true, // require email verification before allowing sign in

    sendResetPassword: async ({user, url}) => {
      await resend.emails.send({
       from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        react: ForgotPasswordEmail({ username: user.name, resetUrl: url, userEmail: user.email }),
      });
    },


    },

    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: FullSchema, 
    })
});


/*
1. Users authenticate through Better Auth
2. When they sign up, a corresponding Polar customer is automatically created */