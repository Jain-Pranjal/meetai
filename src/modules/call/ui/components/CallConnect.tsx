// https://getstream.io/video/docs/react/basics/quickstart/#client-setup--calls
// https://getstream.io/video/docs/react/ui-components/core/stream-video/
"use client";

import {
Call,
CallControls,
CallingState,
StreamCall,
StreamVideo,
StreamVideoClient
} from "@stream-io/video-react-sdk";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect,useState } from "react";
import { useTRPC } from "@/trpc/client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { CallUI } from "./CallUI";




interface Props{
    meetingId: string;
    meetingName: string;  
    userId: string;
    userName: string;
    userImage: string
}

export const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }: Props) => {

    const trpc = useTRPC();
    const {mutateAsync:generateToken}=useMutation(trpc.meetings.generateToken.mutationOptions());

    const [client,setClient] = useState<StreamVideoClient>(); //this is the frontend client


    // making the client instance of the frontend client as Before joining a call, it is necessary to set up the video client
    // basically we are making a token for the user to join the call on the frontend by making a client instance
    useEffect(() => {
        const _client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
            user:{
                id:userId,
                name:userName,
                image:userImage,
            },
            tokenProvider:generateToken,
        });

        setClient(_client);

        return ()=>{
            _client.disconnectUser();
            setClient(undefined);
        }
    }, [userId, userName, userImage, generateToken]);


// making the call instance that will actually set up the call
    const[call,setCall] = useState<Call>();
    useEffect(() => {
        if (!client) return;

        const _call = client.call("default",meetingId);
        _call.camera.disable();
        _call.microphone.disable();

        setCall(_call);

        return () => {
            // checking condtion of the call state before leaving and ending the call
            if(_call.state.callingState!==CallingState.LEFT){
                _call.leave();
                _call.endCall();
                setCall(undefined);
// Every call instance has its own local state managed by the SDK.

            }

        };
    }, [client, meetingId]);

    if(!client || !call) {
        return (
            <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar ">
                <LoaderIcon className="animate-spin size-6 text-white" />
            </div>
        );
    }

    return (
        <StreamVideo client={client}>{/*passing the stream frontend client instance*/} 
            <StreamCall call={call} > {/*passing the call instance*/}
                <CallUI meetingName={meetingName} />
            </StreamCall>
        </StreamVideo> 
    );
};


// This component is responsible for connecting to the call using the Stream Video SDK. and making the token for the user so that the user can join the call.
