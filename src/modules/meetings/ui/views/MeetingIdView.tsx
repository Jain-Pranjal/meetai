"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Loading } from "@/components/Loading";
import { Error } from "@/components/ErrorState";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import { MeetingIdViewHeader } from "../components/MeetingIdViewHeader";
import { UpdateMeetingDialog } from "../components/UpdateMeetingDialog";
import { UpcomingState } from "../components/UpcomingState";
import { ActiveState } from "../components/ActiveState";
import { CancelledState } from "../components/CancelledState";
import { ProcessingState } from "../components/ProcessingState";

interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router=useRouter();
  const queryClient=useQueryClient()
  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);


//   fetching the meeting data using cache
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );


  const isActive = data.status === "active";
  const isCompleted = data.status === "completed";
  const isCancelled = data.status === "cancelled";
  const isUpcoming = data.status === "upcoming";
  const isProcessing = data.status === "processing";

  
// api call to remove the meeting
const removeMeeting= useMutation(trpc.meetings.remove.mutationOptions({
    onSuccess: async() => {
      await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
      router.push("/meetings");
    },
    onError: (error) => {
        toast.error(
            error.message || "Failed to remove meeting. Please try again later."
        );
    },
}));

    const [RemoveConfirmationDialog, confirmRemove] = useConfirm("Are you sure you want to remove this meeting?", `The following meeting will be remove this meeting`);

    const handleRemoveMeeting=async () => {
        const ok = await confirmRemove();
        if (!ok) {
            return;
        }
        removeMeeting.mutate({ id: meetingId });
    };

  return (
    <>
    {/* render the confirm dialog */}
      <RemoveConfirmationDialog />
      
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />

    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <MeetingIdViewHeader
        meetingId={meetingId}
        meetingName={data.name}
        onEdit={() => setUpdateMeetingDialogOpen(true)}
        onRemove={() => handleRemoveMeeting()}
      />

      {isCancelled && <CancelledState/>}
      {isUpcoming && <UpcomingState  meetingId={meetingId} onCancel={()=>{}} isCanceling={false} />}
      {isActive && <ActiveState meetingId={meetingId} />}
      {isProcessing && <ProcessingState />}
    </div>
</>
  );
};



export const MeetingIdViewLoading = () => {
  return (
    <Loading
      title="Loading Meeting"
      description="Please wait while we load the meeting."
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <Error title="Error loading meeting" description="Please try again later." />
  );
};
