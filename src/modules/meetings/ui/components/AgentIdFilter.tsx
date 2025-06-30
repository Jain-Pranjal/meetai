import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { CommandSelect } from "@/components/CommandSelect";
import { generatedAvatar } from "@/components/generated-avatar";

import { useMeetingsFilter } from "../../hooks/use-meetings-filter";



export const AgentIdFilter = () => {
    const [filter, setFilter] = useMeetingsFilter();
    const trpc = useTRPC();
    const [agentSearch, setAgentSearch] = useState("");
    // the setAgentSearch will be used to filter the agents by changing the agentSearch state and then triggering a re-fetch of the agent data and it will again refetch the agents with the new search term from the db 



    const {data} = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        })
    );


    return (
        <CommandSelect
            placeholder="Agent"
            className="h-9"
            options={(data?.items ?? []).map((agent) => ({
                id: agent.id,
                value: agent.id,
                children: (
                    <div className="flex items-center gap-x-2">
                        {generatedAvatar({
                            seed: agent.name || "User",
                            variant: "botttsNeutral",
                            className: "size-4"
                        })}
                        <span>{agent.name}</span>
                    </div>
                )
            }))}

            onSelect={(value) => setFilter({ agentId:value })}
            onSearch={setAgentSearch} //it will search from db
            value={filter.agentId || ""}
        />
    );
};
