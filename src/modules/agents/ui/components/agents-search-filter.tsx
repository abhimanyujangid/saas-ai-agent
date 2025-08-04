import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

import { useAgentFilters } from "../../hook/use-agent-filters"

export const SearchFilter = () => {
  const [filter, setFilter] = useAgentFilters()

  return (
    <div className="relative ">
      <Input
        placeholder="Filter by name"
        value={filter.search}
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        className="w-full bg-white dark:bg-slate-800 pl-8"
      />
      <SearchIcon className="size-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
  