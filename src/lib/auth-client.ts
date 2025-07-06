// Better Auth client instance
import { polarClient } from "@polar-sh/better-auth"
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    plugins:[polarClient()]
    
})


// this is the client-side auth client that is responsible for handling the communication with the server-side auth handler. 
// so for any method and function to use then we will be using this authClient
