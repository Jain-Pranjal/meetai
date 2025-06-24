"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loading } from "@/components/Loading";
import { Error } from "@/components/ErrorState";
import { DataTable } from "@/components/DataTable";
import {columns} from "@/modules/meetings/ui/components/Columns";
import { EmptyState } from "@/components/EmptyState";

export const MeetingsView=()=>{

    const trpc= useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({})
    );


    return (
        <div className="flex-1 pb-4 md:px-8 px-4 flex flex-col gap-y-4">
            <DataTable data={data.items}
            columns={columns}/>

        {data.items.length === 0 && (
        <EmptyState title="No Meetings Found" description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas and interact with participants during the call." />
                    )}

        </div>
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