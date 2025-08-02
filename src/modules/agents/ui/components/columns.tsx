"use client";

import { ColumnDef } from "@tanstack/react-table";
// types
import { AgentGetOne } from "../../types";

// components
import { GeneratedAvatar } from "@/components/generated-avatar";


// Icons
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <GeneratedAvatar
            variant="bottts"
            seed={row.original.name}
            className="size-6"
          />
          <span className="text-sm font-semibold capitalize">
            {row.original.name}
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground max-w-[200px] truncate capitalize">
            {row.original.instruction}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meeting",
    cell: ({ row }) => (
     <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
        <VideoIcon className="size-4 text-blue-700" />
        5 Meetings  
        {/* {row.original.meetingCount} {row.original.meetingCount === 1 ? "Meeting" : "Meetings"} */}
      </Badge>
    ),   
  },
];
