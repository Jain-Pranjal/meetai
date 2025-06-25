import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VideoIcon,BanIcon } from "lucide-react";


interface Props{
    meetingId: string;
    onCancel: () => void;
    isCanceling: boolean;
}


export const UpcomingState = ({ meetingId, onCancel, isCanceling }: Props) => {
  return (
    <div className="bg-white rounded-lg flex flex-col items-center justify-center px-4 py-5">
      <EmptyState
        title="No Upcoming Meetings"
        description="Once you start this meeting, a summary will appear here"
        image="/upcoming.svg"
      />

        <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-6 w-full pt-3" >

            <Button
              variant="secondary"
              className="w-full lg:w-auto"
                onClick={onCancel}
                disabled={isCanceling}
            >
              <BanIcon /> Cancel Meeting
            </Button>

            <Button asChild
              disabled={isCanceling}
              className="w-full lg:w-auto"
            >
                <Link href={`/call/${meetingId}`}>
                    <VideoIcon /> Start Meeting
                </Link>
            </Button>


        </div>

    </div>
  );
}