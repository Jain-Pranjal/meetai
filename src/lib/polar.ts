import {Polar} from "@polar-sh/sdk";

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server:"sandbox"
});

// the access token is generated for the sandbox environment, 
// For production, you need to generate a token from the prod env 