import ResponsiveDialog from "@/components/ResponsiveDialog";
import { MeetingForm } from "./MeetingForm";
import {useRouter} from "next/navigation";

interface NewMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({ open, onOpenChange }: NewMeetingDialogProps) => {

  const router = useRouter();
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New Meeting"
      description="Create a new meeting."
    >

      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => {
          onOpenChange(false);
        }}
      />

    </ResponsiveDialog>
  );
}



// this dialog is used to open the form of the meeting

// open and onOpenChange are used to control the dialog state so it can be close by the form also as we are passing the state of the dialog only 