"use client";

// Format
import { format } from "date-fns";
import humanizeDuration from "humanize-duration";

import { ColumnDef } from "@tanstack/react-table";
// types
import { MeetingGetMany } from "../../types";

// components
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Icons
import {
  CornerDownRightIcon,
  VideoIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  LoaderIcon,
} from "lucide-react";
import { ca, ro } from "date-fns/locale";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

const statusIconsMap = {
  completed: CircleCheckIcon,
  cancelled: CircleXIcon,
  upcoming: ClockArrowUpIcon,
  active: ClockFadingIcon,
  processing: LoaderIcon,
};

const statusColorsMap = {
  completed: "text-green-500/20 text-green-800 border-green-800/5",
  processing: "text-gray-300/20 text-gray-800 border-gray-800/5 ",
  upcoming: "text-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "text-blue-500/20 text-blue-800 border-blue-800/5",
  cancelled: "text-rose-500/20 text-rose-800 border-rose-800/5",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="text-sm font-semibold capitalize">
          {row.original.name || "No Name Provided"}
        </span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground max-w-[200px] truncate capitalize">
              {row.original.agent.name || "No Agent Assigned"}
            </span>
          </div>
          <GeneratedAvatar
            className="size-6"
            variant='bottts'
            seed={row.original.agent.name}
          />
          <span className="text-xs text-muted-foreground">
            {row.original.startedAt ? format(new Date(row.original.startedAt), "dd MMM yyyy, HH:mm") : "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon = statusIconsMap[row.original.status as keyof typeof statusIconsMap];
      return (
        <Badge variant="outline" className={cn("capitalize [&>svg]:size-4 text-muted-foreground", statusColorsMap[row.original.status])}>
          <Icon className={cn(
            row.original.status === "processing" ? "animate-spin" : "",
          )} />
          {row.original.status}
        </Badge>
      );
    },
  },
 {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className={cn("capitalize [&>svg]:size-4 flex items-center gap-x-2")}>
          <ClockFadingIcon className="text-blue-700" />
          {row.original.duration ? formatDuration(row.original.duration) : "No Duration"}
        </Badge>
      );
    },
  },
];
