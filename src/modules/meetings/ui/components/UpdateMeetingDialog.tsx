import ResponsiveDialog from "@/components/ResponsiveDialog";
import { MeetingForm } from "./MeetingForm";
import { MeetingGetOne } from "../../types";

interface UpdateMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: MeetingGetOne;
}

export const UpdateMeetingDialog = ({ open, onOpenChange, initialValues }: UpdateMeetingDialogProps) => {


  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Meeting"
      description="Edit the meeting details."
    >

      <MeetingForm
        initialValues={initialValues}
        onSuccess={() => {
          onOpenChange(false);
        }}
        onCancel={() => onOpenChange(false)}
      />

    </ResponsiveDialog>
  );
}



// this dialog is used to open the form of the meeting