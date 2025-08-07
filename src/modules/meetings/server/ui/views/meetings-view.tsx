"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const MeetingView = () => {
  const trpc = useTRPC();
  const { data, isLoading, error } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({})
  );

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
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
