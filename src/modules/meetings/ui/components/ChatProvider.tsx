"use client"

import { authClient } from "@/lib/auth-client"
import { Loading } from "@/components/Loading"
import { ChatUI } from "./ChatUI"

interface Props {
    meetingId: string
}


export const ChatProvider = ({ meetingId }: Props) => {
    const { data, isPending } = authClient.useSession() 
    if(isPending || !data) {
        return <Loading title="Loading ...." description="Please wait while we load the chat." />
    }


    return (
        <ChatUI
            meetingId={meetingId}
            userId={data.user.id}
            userName={data.user.name}
            userImage={data.user.image??""}
        />
    )

}