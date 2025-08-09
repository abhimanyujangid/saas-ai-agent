"use client";


import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { DEFAULT_PAGE } from "@/constants/constants";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingsSearchFilter } from "./meetings-search-filter";

export const MeetingsListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    // const isAnyFilterModified = !!filter.search;

  
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
        <div className="flex items-center gap-x-2 max-w-[19rem]">
         <MeetingsSearchFilter />
        </div>
      </div>
    </>
  );
};
