"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import LoadingState from "./loading-state";
import ErrorState from "./error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";



export const AgentView = () => {
    
    const trpc = useTRPC();
    const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div>
            {/* {
                JSON.stringify(agents, null, 2)
            } */}
            <ResponsiveDialog
                open={true}
                onOpenChange={() => {}}
                title="Agents"
                description="Manage your agents here."
            >
                <Button >
                    Create New Agent
                </Button>
            </ResponsiveDialog>
        </div>
    );
};


export const AgentViewLoading = () => {
    return (
        <LoadingState title="Loading Agents" description="Please wait while we fetch the agents." />
    );
}


export const AgentViewError = () => {
    return (
        <ErrorState title="Error Loading Agents" description="An error occurred while loading the agents." />
    );
};