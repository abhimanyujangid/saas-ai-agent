import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

import { useMeetingFilters } from "../../hook/use-meetingd-filters"

export const MeetingsSearchFilter = () => {
  const [filter, setFilter] = useMeetingFilters()

  return (
    <div className="relative w-full">
      <Input
        placeholder="Filter by name"
        value={filter.search}
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        className="w-full bg-white dark:bg-slate-800 pl-8 h-9"
      />
      <SearchIcon className="size-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
  