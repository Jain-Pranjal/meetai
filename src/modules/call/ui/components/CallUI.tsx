import { StreamTheme,useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./CallLobby";
import { CallActive } from "./CallActive";
import { CallEnded } from "./CallEnded";


interface Props{
    meetingName: string;
}


export const CallUI = ({ meetingName }: Props) => {
    // using the useCall hook to get the call instance state
    const call = useCall();
    const [show, setShow] = useState<"lobby"|"call"|"ended">("lobby");

    // call is the same instance that we had created in callConnect.tsx


// leaving the call
    const handleLeave = () => {
        if(!call)   return;
        call.endCall();
        setShow("ended");

    }

    // start the call
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

// so we can use the useCall to find the current state of the call