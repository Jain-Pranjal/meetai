import { StreamTheme,useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./CallLobby";
import { CallActive } from "./CallActive";
import { CallEnded } from "./CallEnded";


interface Props{
    meetingName: string;
}


export const CallUI = ({ meetingName }: Props) => {
    const call = useCall();
    const [show, setShow] = useState<"lobby"|"call"|"ended">("lobby");
    


    const handleLeave = () => {
        if(!call)   return;
        call.endCall();
        setShow("ended");

    }

    const handleJoin = () => {
        if(!call) return;
        call.join();
        setShow("call");
    }

    return (
        <StreamTheme className="h-full">
            {show === "lobby" && <CallLobby onJoin={() => handleJoin()} />}
            {show === "call" && <CallActive onLeave={() => handleLeave()} meetingName={meetingName} />}
            {show === "ended" && <CallEnded />}

        </StreamTheme>
    )
}