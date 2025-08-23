import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VideoIcon, BanIcon } from "lucide-react";

interface Props {
    meetingId?: string;
    onCancelMeeting: () => void;
    isCancelling: boolean;
}

export const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 bg-background rounded-lg px-4 py-5 ">
      <EmptyState
        imageSrc="/upcoming.svg"
        title="Not started yet"
        description="Once you start this meeting, a summary will be generated."
      />
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-4 w-full">
        <Button variant="secondary" className="w-full lg:w-auto" onClick={onCancelMeeting} disabled={isCancelling}>
          <BanIcon />
          Cancel meeting
        </Button>
        <Button asChild className="w-full lg:w-auto" disabled={isCancelling}>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
