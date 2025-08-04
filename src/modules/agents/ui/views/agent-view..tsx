"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import LoadingState from "../../../../components/loading-state";
import ErrorState from "../../../../components/error-state";

import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import EmptyState from "../components/empty-state";
import { useAgentFilters } from "../../hook/use-agent-filters";
import { DataPagination } from "../components/dataPagination";

export const AgentView = () => {
  const [filters, setFilters] = useAgentFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <div className="p-4 flex-1 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data.items} />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onChangePage={(page) => setFilters((prev) => ({ page }))}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meeting. Each agent will follow your instructions. "
        />
      )}
    </div>
  );
};

export const AgentViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="Please wait while we fetch the agents."
    />
  );
};

export const AgentViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="An error occurred while loading the agents."
    />
  );
};
