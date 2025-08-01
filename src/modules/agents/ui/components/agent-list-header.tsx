"use client";


import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";

export const AgentListHeader = () => {

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
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
      </div>
    </>
  );
};
