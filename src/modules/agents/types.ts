import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
export type AgentGetMany = inferRouterOutputs<AppRouter>["agents"]["getMany"]["items"];

// we are getting the type fo the getOne from the agents router which have all the procedures defined in it

// bascially we are not creating the new type but inferring the type from the getOne procedure in the agents router as it will have all the types defined in it and we need to use them same only to populate the form with the initial values


// this will define what the initial values of the form will be as it will have the exact same as we are using in the getOne procedure