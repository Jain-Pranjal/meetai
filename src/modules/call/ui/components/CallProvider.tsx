"use client";

import { LoaderIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { CallConnect } from "./CallConnect";
import { generatedAvatarURI } from "@/lib/avatar";


interface Props {
    meetingId: string;
    meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
    const {data,isPending} = authClient.useSession();  //getting the user session details using the client as it is a client component

    if(!data || isPending) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar ">
                <LoaderIcon className="animate-spin size-6 text-white" />
            </div>
        );

    }

    return (
       <CallConnect
           meetingId={meetingId}
           meetingName={meetingName}
           userId={data.user.id}
           userName={data.user.name}
           userImage={data.user.image ?? generatedAvatarURI({seed: data.user.name, variant: "initials"})}
       />
    )




}