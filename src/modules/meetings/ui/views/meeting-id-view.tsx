"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import MeetingIdViewHeader from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";

interface Props {
  meetingId: string;
}

export const MeetingIdView =  ({ meetingId }: Props) => {

    const [updateMeetingDialogOpen , setUpdateMeetingDialogOpen] = useState<boolean>(false);

    // Fetch the meeting data
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  );

  const [ RemoveConfirmation, confirmRemove ] = useConfirm(
    "Are you sure you want to remove this meeting?",
    "The meeting will be permanently deleted and cannot be recovered.",
  );


  const router = useRouter();

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            router.push("/meetings");
        },
        onError: (error) => {
          toast.error(`Error removing meeting: ${error.message}`);
        },
    })
  );

  const handleRemove = async () => {
    const ok = await confirmRemove();

    if (!ok)  return;

    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isActive = data.status === "active";
  const isUpcoming = data.status === "upcoming";
  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";
  const isProcessing = data.status === "processing";

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        openChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex-flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data?.name}
          onEdit={() => setUpdateMeetingDialogOpen(true) }
          onRemove={handleRemove}
        />
       {isCancelled && <div>Meeting has been cancelled</div>}
       {isCompleted && <div>Meeting has been completed</div>}
       {isProcessing && <div>Meeting is currently being processed</div>}
       {isUpcoming && <div>Meeting is scheduled for</div>}
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex-flex-col gap-y-4">
      <LoadingState
        title="Loading Meeting"
        description="Please wait while we fetch the meeting details."
      />
    </div>
  );
};

export const MeetingIdViewError = () => {
  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex-flex-col gap-y-4">
      <ErrorState
        title="Error Loading Meeting"
        description="An error occurred while loading the meeting details."
      />
    </div>
  );
};
