"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { useMeetingFilters } from "../../hook/use-meetingd-filters";


export const AgentIdFilter = () => {
    const [filter, setFilter] = useMeetingFilters();

    const trpc = useTRPC();
    const [agentSearch, setAgentSearch] = useState<string>("");
    const{ data } = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        }),
    );

    return (
        <CommandSelect
            value={filter.agentId ?? ""}
            onSelect={(value) => setFilter({ agentId: value })}
            onSearch={setAgentSearch}
            option={data?.items.map((agent) => ({
                id: agent.id,
                value: agent.id,
                children: (
                    <div className="flex items-center gap-x-2">
                        <GeneratedAvatar
                            variant="bottts"
                            seed={agent.name}
                            className="size-4"
                        />
                        {agent.name}
                    </div>
                ),
            })) ?? []}
            placeholder="Filter by agent"
            className="h-9"
        />
    );
}