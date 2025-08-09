import { ResponsiveDialog } from "@/components/responsive-dialag";
import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";

interface updateMeetingDialogProps {
  open: boolean;
  openChange: (open: boolean) => void;
  initialValues?: MeetingGetOne;
}


export const UpdateMeetingDialog = ({ open, openChange, initialValues }: updateMeetingDialogProps) => {


  return (
    <ResponsiveDialog open={open} onOpenChange={openChange} title="Edit Meeting" description="Edit the meeting details">
     <MeetingForm 
       initialValues={initialValues}
       onSuccess={(id) => openChange}
       onCancel={() => openChange(false)}
     />
    </ResponsiveDialog>
  );
};
