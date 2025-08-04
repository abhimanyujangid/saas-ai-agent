import { auth } from "@/lib/auth";
import { AgentListHeader } from "@/modules/agents/ui/components/agent-list-header";
import {
  AgentView,
  AgentViewError,
  AgentViewLoading,
} from "@/modules/agents/ui/views/agent-view.";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


//  NUQS SearchParams type
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";
import { fi } from "date-fns/locale";


interface PageProps {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: PageProps) => {
  const filters = await loadSearchParams(searchParams);
  const session = await  auth.api.getSession({
    headers: await headers(),
  })
  
  if (!session) {
    redirect("/sign-in");
  }
  

  // Prefetch agents data on the server side
  const queryClient = getQueryClient();

  // Use the TRPC client to fetch agents data
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
    ...filters,
  }));



  return (
    <>
      <AgentListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentViewLoading />}>
          <ErrorBoundary fallback={<AgentViewError />}>
            <AgentView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
