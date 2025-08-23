import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VideoIcon } from "lucide-react";

interface Props {
    meetingId?: string;
}

export const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 bg-background rounded-lg px-4 py-5 ">
      <EmptyState
        imageSrc="/upcoming.svg"
        title="Meeting is Active"
        description="Meeting will end once all participants leave."
      />
      <div className="flex flex-col-reverse lg:flex-row items-center lg:justify-center gap-4 w-full">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
