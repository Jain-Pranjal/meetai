// This form will open the new form with initial values nothing as it is a new agent dialog


import ResponsiveDialog from "@/components/ResponsiveDialog";
import {AgentForm} from "@/modules/agents/ui/components/AgentForm";
interface NewAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New Agent"
      description="Create a new agent."
    >

     <AgentForm
      onSuccess={() => {onOpenChange(false);}} //it will close the dialog on success
      onCancel={() => {onOpenChange(false);}}  //it will close the dialog on cancel
      initialValues={{
        id: "",
        name: "",
        createdAt: "",
        updatedAt: "",
        userId: "",
        instructions: "",
        meetingCount: 0,
      }}
      />

    </ResponsiveDialog>
  );
}
