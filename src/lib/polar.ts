import {Polar} from "@polar-sh/sdk";

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN_PROD!,
    server:"production" //use sandbox for development
});

// the access token is generated for the sandbox environment, 
// For production, you need to generate a token from the prod env 