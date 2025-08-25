"use client";


import ErrorState from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

// UI
import { CallProvider } from "../components/call-provider";

interface Props {
    meetingId: string;
}


export const CallView =  ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

    if(data.status === "completed") {
       return (
         <div className="flex-1 flex items-center justify-center">
            <ErrorState 
            title="Meeting has already been completed"
            description="You can no longer join this meeting."
            />
        </div>
       )
    }

    // Fetch meeting details using meetingId
    return <CallProvider meetingId={meetingId} meetingName={data.name} />;
}