"use client";
// UI components
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import AgentIdViewHeader from "../components/agent-is-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";


//  TRPC
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";


interface Props {
  agentId: string;
}

const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data?.name}
        onEdit={() => {}} // Placeholder for edit function
        onRemove={() => {}} // Placeholder for remove function
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar variant="bottts" seed={data?.name} className="size-10" />
            <h2 className="text-2xl font-medium">{data?.name}</h2>
          </div>
          <Badge 
          variant='outline'
          className="flex items-center gap-x-2 [&>svg]:size-4">
            <VideoIcon  className="text-blue-700"/>
            {data.meetingCount} {data.meetingCount === 1 ? "Meeting" : "Meetings"}
          </Badge>
          <div className="flex flex-col gap-y-4">
            <p className="font-medium text-lg">Instructions</p>
            <p className="text-gray-800">{data?.instruction || "No Instructions Available"}</p>
          </div>
        </div>

      </div>
      {/* You can add more components here to display agent details */}
    </div>
  );
};

export default AgentIdView;

export const AgentIDViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="Please wait while we fetch the agents."
    />
  );
};

export const AgentIDViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="An error occurred while loading the agents."
    />
  );
};
