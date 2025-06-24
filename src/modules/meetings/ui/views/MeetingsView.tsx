"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loading } from "@/components/Loading";
import { Error } from "@/components/ErrorState";

export const MeetingsView=()=>{

    const trpc= useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({})
    );


    return (
        <p>{data.items.length} meetings found</p>
    );
}



export const MeetingsViewLoading = () => {
    return (
        <Loading title='Loading Meetings' description='Please wait while we load the meetings.' />
    )
}

export const MeetingsViewError = () => {
    return (
        <Error
            title="Error loading meetings"
            description="Please try again later."
        />
    )
}