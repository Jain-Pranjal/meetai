import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VideoIcon } from "lucide-react";


interface Props{
    meetingId: string;
}


export const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="bg-white rounded-lg flex flex-col items-center justify-center px-4 py-5">
      <EmptyState
        title="Meeting is Active"
        description="Meeting will end when all participants leave"
        image="/upcoming.svg"
      />

        <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full" >

           

            <Button asChild
              className="w-full lg:w-auto"
            >
                <Link href={`/call/${meetingId}`}>
                    <VideoIcon /> Join Meeting
                </Link>
            </Button>


        </div>

    </div>
  );
}