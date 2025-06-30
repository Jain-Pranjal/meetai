
// this dialog is used to update an agent

import ResponsiveDialog from "@/components/ResponsiveDialog";
import {AgentForm} from "@/modules/agents/ui/components/AgentForm";
import { AgentGetOne } from "../../types";
interface UpdateAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: AgentGetOne;
}

export const UpdateAgentDialog = ({ open, onOpenChange, initialValues }: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Agent"
      description="Edit the agent's information."
    >

  
      <AgentForm
        onSuccess={() => {onOpenChange(false);}}
        onCancel={() => {onOpenChange(false);}}
        initialValues={initialValues}
      />

    </ResponsiveDialog>
  );
}

