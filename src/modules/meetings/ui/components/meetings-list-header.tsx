"use client";


import { Button } from "@/components/ui/button";
import { useState } from "react";

// Icons
import { PlusIcon, XCircleIcon } from "lucide-react";


// UI Components
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";

// Hooks
import { useMeetingFilters } from "../../hook/use-meetingd-filters";
import { DEFAULT_PAGE } from "@/constants/constants";

export const MeetingsListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [filter, setFilter] = useMeetingFilters();

    // Check if any filter is modified
    const isAnyFilterModified = !!filter.search || !!filter.status || !!filter.agentId;

    const handleResetFilters = () => {
        setFilter({ search: "", status: null, agentId: "", page: DEFAULT_PAGE });
    };

  
  return (
    <>
      <NewMeetingDialog open={isDialogOpen} openChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="size-4" />
            New Meeting
          </Button>
        </div>
        <div className="flex items-center gap-x-2 w-full max-w-3xl">
          <div className="flex-1 min-w-0">
            <MeetingsSearchFilter />
          </div>
          <div className="flex-shrink-0 w-48">
            <StatusFilter />
          </div>
           <div className="flex-shrink-0 w-48">
            <AgentIdFilter />
          </div>
          {
            isAnyFilterModified && (
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={handleResetFilters}
              >
                <XCircleIcon className="size-4" />
                Reset Filters
              </Button>
            )
          }
        </div>
      </div>
    </>
  );
};
