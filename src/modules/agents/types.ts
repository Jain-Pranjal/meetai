import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];

// we are getting the type fo the getOne from the agents router which have all the procedures defined in it


// this type is made by the return type of the getOne procedure from the db