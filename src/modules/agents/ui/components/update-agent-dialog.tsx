import { ResponsiveDialog } from "@/components/responsive-dialag";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
  open: boolean;
  openChange: (open: boolean) => void;
  initialValues?: AgentGetOne;
}


export const UpdateAgentDialog = ({ open, openChange, initialValues }: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog open={open} onOpenChange={openChange} title="Edit Agent" description="Edit a  agent">
     <AgentForm 
     onSuccess={() => openChange(false)}
     onCancel={() => openChange(false)}
     initialValues={initialValues}
     />
    </ResponsiveDialog>
  );
};
