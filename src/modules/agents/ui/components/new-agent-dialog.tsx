import { ResponsiveDialog } from "@/components/responsive-dialag";

interface NewAgentDialogProps {
  open: boolean;
  openChange: (open: boolean) => void;
}


export const NewAgentDialog = ({ open, openChange }: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog open={open} onOpenChange={openChange} title="New Agent" description="Create a new agent">
      new agent form goes here
    </ResponsiveDialog>
  );
};
