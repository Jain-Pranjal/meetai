import {Polar} from "@polar-sh/sdk";
export const polarClient = new Polar({
    accessToken: process.env.NEXT_PUBLIC_PRODUCTION === 'true' 
        ? process.env.POLAR_ACCESS_TOKEN_PROD!
        : process.env.POLAR_ACCESS_TOKEN_DEV!,
    server: process.env.NEXT_PUBLIC_PRODUCTION === 'true' ? "production" : "sandbox"
});

// the access token is generated for the sandbox environment, 
// For production, you need to generate a token from the prod env 