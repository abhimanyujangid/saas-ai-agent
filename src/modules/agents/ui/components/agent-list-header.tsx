"use client";


import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentFilters } from "../../hook/use-agent-filters";
import { SearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants/constants";

export const AgentListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [filter, setFilter] = useAgentFilters(); 

    const isAnyFilterModified = !!filter.search;

    const onClearFilters = () => {
        setFilter({
            search: '',
            page: DEFAULT_PAGE,
        });
    };
  return (
    <>
      <NewAgentDialog open={isDialogOpen} openChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Agent</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="size-4" />
            New Agent
          </Button>
        </div>
        <div className="flex items-center gap-x-2 max-w-[19rem]">
          <SearchFilter />
          {
            isAnyFilterModified && (
              <Button variant="outline" onClick={onClearFilters} size="sm" className="ml-auto">
               <XCircleIcon className="size-4" />
               Clear
              </Button>
            )
          }
        </div>
      </div>
    </>
  );
};
