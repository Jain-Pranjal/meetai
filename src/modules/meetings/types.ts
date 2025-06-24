import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];
export enum MeetingStatus {
    Upcoming = "upcoming",
    Active = "active",
    Processing = "processing",
    Completed = "completed",
    Cancelled = "cancelled",
}



// it will make the same type as the return of the getOne procedure in the meetings router