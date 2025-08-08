"use client";

//UI
import { DataTable } from "@/components/data-table";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";

// TRPC
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

// Types
import { columns } from "../components/columns";
import EmptyState from "@/modules/agents/ui/components/empty-state";

export const MeetingView = () => {
  const trpc = useTRPC();
  const { data, isLoading, error } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({})
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4
    ">
      <DataTable data={data.items} columns={columns}  />
       {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Create a meeting to join your agent. Each meeting will follow your instructions."
        />
      )}
    </div>
  )
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="Please wait while we fetch the meetings."
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meetings"
      description="An error occurred while loading the meetings."
    />
  );
};
