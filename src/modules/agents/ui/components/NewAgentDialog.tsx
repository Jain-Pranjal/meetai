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
      onSuccess={() => {onOpenChange(false);}}
      onCancel={() => {onOpenChange(false);}}
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
      {/* we will add the proper form to interact with the db to send the data to the db later on */}

    </ResponsiveDialog>
  );
}
