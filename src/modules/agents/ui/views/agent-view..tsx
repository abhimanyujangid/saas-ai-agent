"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import LoadingState from "./loading-state";
import ErrorState from "./error-state";



export const AgentView = () => {
    
    const trpc = useTRPC();
    const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div>
            {
                JSON.stringify(agents, null, 2)
            }
        </div>
    );
};


export const AgentViewLoadding = () => {
    return (
        <LoadingState title="Loading Agents" description="Please wait while we fetch the agents." />
    );
}


export const AgentViewError = () => {
    return (
        <ErrorState title="Error Loading Agents" description="An error occurred while loading the agents." />
    );
};