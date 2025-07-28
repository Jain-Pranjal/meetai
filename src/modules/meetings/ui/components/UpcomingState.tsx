import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VideoIcon } from "lucide-react";


interface Props{
    meetingId: string;
}


export const UpcomingState = ({ meetingId }: Props) => {
  return (
    <div className="bg-white rounded-lg flex flex-col items-center justify-center px-4 py-5">
      <EmptyState
        title="No Upcoming Meetings"
        description="Once you start this meeting, a summary will appear here"
        image="/upcoming.svg"
      />

        <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-6 w-full pt-3" >

            <Button asChild
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