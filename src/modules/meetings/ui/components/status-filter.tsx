// Icons
import {
  CornerDownRightIcon,
  VideoIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
} from "lucide-react";

import { CommandSelect } from "@/components/command-select";

import { MeetingStatus } from "../../types";
import { useMeetingFilters } from "../../hook/use-meetingd-filters";

const options = [
  {
    id: MeetingStatus.UPCOMING,
    value: MeetingStatus.UPCOMING,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon  />
        {MeetingStatus.UPCOMING}
      </div>
    ),
  },
  {
    id: MeetingStatus.ACTIVE,
    value: MeetingStatus.ACTIVE,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon  />
        {MeetingStatus.ACTIVE}
      </div>
    ),  
  },
  {
    id: MeetingStatus.COMPLETED,
    value: MeetingStatus.COMPLETED,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon  />
        {MeetingStatus.COMPLETED}
      </div>
    ),
  },
  {
    id: MeetingStatus.CANCELLED,
    value: MeetingStatus.CANCELLED,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon  />
        {MeetingStatus.CANCELLED}
      </div>
    ),
  },
  {
    id: MeetingStatus.PROCESSING,
    value: MeetingStatus.PROCESSING,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon  />
        {MeetingStatus.PROCESSING}
      </div>
    ),
  }
];


export const StatusFilter = () => {
    const [filter, setFilters] = useMeetingFilters();

    const handleSelect = (value: string) => {
        setFilters({ status: value as MeetingStatus });
    };

    const handleSearch = (query: string) => {
        // Optional: implement search functionality if needed
    };

    return (
        <CommandSelect
            value={filter.status ?? ""}
            onSelect={handleSelect}
            onSearch={handleSearch}
            option={options}
            placeholder="Filter by status"
            className="h-9"
        />
    )
}