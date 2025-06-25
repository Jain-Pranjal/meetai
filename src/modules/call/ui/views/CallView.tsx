"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {Error} from "@/components/ErrorState"
import { CallProvider } from "../components/CallProvider";
interface Props{
    meetingId: string;
}


export const CallView=({meetingId}:Props) => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getOne.queryOptions({
        id: meetingId
    }));


    if (data.status==="completed"){
        return (
            <div className="flex h-screen items-center justify-center">
                <Error
                    title="Meeting has ended"
                    description="This meeting has already ended. You can no longer join."
                />
            </div>
        )
    }



    return (
        <CallProvider 
            meetingId={meetingId} 
            meetingName={data.name}
        />
    )
}

