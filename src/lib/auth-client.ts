// Better Auth client instance
import { polarClient } from "@polar-sh/better-auth"
import { createAuthClient } from "better-auth/react"
import { oneTapClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins:[polarClient(),

    oneTapClient({
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      // Optional client configuration:
      autoSelect: false,
      cancelOnTapOutside: true,
      context: "signin",
      additionalOptions: {
        // Any extra options for the Google initialize method
      },
      // Configure prompt behavior and exponential backoff:
      promptOptions: {
        baseDelay: 1000,   // Base delay in ms (default: 1000)
        maxAttempts: 5     // Maximum number of attempts before triggering onPromptNotification (default: 5)
      }
    })

    ]
    
})


// this is the client-side auth client that is responsible for handling the communication with the server-side auth handler. 
// so for any method and function to use then we will be using this authClient
