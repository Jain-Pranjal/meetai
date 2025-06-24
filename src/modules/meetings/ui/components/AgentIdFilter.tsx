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
            onSearch={setAgentSearch}
            value={filter.agentId || ""} 
        />
    );
};
