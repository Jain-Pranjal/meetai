import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAgentsFilter } from "../../hooks/use-agents-filter";

export const AgentsSearchFilter=()=>{
    const [filters, setFilters] = useAgentsFilter();  //making the state using the nuqs hook 

    return (
        <div className="relative">
            <Input
                placeholder="Search agents..."
                className="h-9 bg-white w-[200px] pl-7"
                value={filters.search || ""}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}
// in this hook we have the 2 things search and page and we are using the search to filter the agents based on the name or instructions

// need to make the same hook that we made in declaring the useQueryStates hook