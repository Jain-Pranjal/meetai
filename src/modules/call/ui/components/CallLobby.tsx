import { LogInIcon } from "lucide-react";
import {
  useConnectedUser,
  ToggleAudioPreviewButton,
  useCallStateHooks,
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  VideoPreview,
  ToggleVideoPreviewButton,
} from "@stream-io/video-react-sdk";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { generatedAvatarURI } from "@/lib/avatar";
import "@stream-io/video-react-sdk/dist/css/styles.css";

interface Props {
  onJoin: () => void;
}

const disabledVideoPreview = ()=>{
    const {data} = authClient.useSession();

    return (
        <DefaultVideoPlaceholder 
        participant={
            {
                name: data?.user.name ?? "",
                image:
                    data?.user.image ??
                    generatedAvatarURI({
                        seed: data?.user.name ?? "",
                        variant: "initials",
                    }),

            } as StreamVideoParticipant
        }/>
    )
}


const allowBrowserPermissions = () => {
    return (
        <p className="text-sm">
            Please allow camera and microphone access in your browser settings.
        </p>
    );
};

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const { hasBrowserPermission: hasMicrophonePermission } =
    useMicrophoneState();

  const hasBrowserMediaPermissions =
    hasCameraPermission && hasMicrophonePermission;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col text-center gap-y-2">
            <h6 className="text-lg font-medium">Ready to Join ?</h6>
            <p className="text-sm">
              Please check your camera and microphone settings before joining.
            </p>
          </div>

          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermissions ? disabledVideoPreview : allowBrowserPermissions
            }
          />

            <div className="flex gap-x-3">
                <ToggleAudioPreviewButton/>
                <ToggleVideoPreviewButton/>
            </div>
            <div className="flex gap-3 justify-between w-full">
                <Button  asChild variant="destructive">
                    <Link href="/meetings">Cancel</Link>
                </Button>

                <Button onClick={onJoin} >
                    <LogInIcon />
                    Join Call
                </Button>
            </div>

        </div>
      </div>
    </div>
  );
};
