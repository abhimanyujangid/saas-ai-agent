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

export const MeetingView = () => {
  const trpc = useTRPC();
  const { data, isLoading, error } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({})
  );

  return (
    <div className="overflow-x-scroll">
      <DataTable data={data.items} columns={columns}  />
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
