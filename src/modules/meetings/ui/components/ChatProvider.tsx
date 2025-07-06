"use client"

import { authClient } from "@/lib/auth-client"
import { Loading } from "@/components/Loading"
import { ChatUI } from "./ChatUI"

interface Props {
    meetingId: string
    meetingName: string
}


export const ChatProvider = ({ meetingId, meetingName }: Props) => {
    const { data, isPending } = authClient.useSession() 
    if(isPending || !data) {
        return <Loading title="Loading ...." description="Please wait while we load the chat." />
    }


    return (
        <ChatUI
            meetingId={meetingId}
            meetingName={meetingName}
            userId={data.user.id}
            userName={data.user.name}
            userImage={data.user.image??""}
        />
    )

}