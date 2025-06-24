"use client"
import {  useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { Loading } from "@/components/Loading"
import { Error } from "@/components/ErrorState"
import { DataTable } from "@/components/DataTable"
import {columns} from "@/modules/agents/ui/components/Columns"
import { EmptyState } from "@/components/EmptyState"
import { useAgentsFilter } from "../../hooks/use-agents-filter"
import { DataPagination } from "@/components/DataPagination"
import { useRouter } from "next/navigation"

// as the data is prefetched in the server component we can use the useSuspenseQuery hook to get the data directly in the client component as it already has the data in the cache

export const AgentView = () => {
    const router=useRouter()
    const [filters,setFilters]=useAgentsFilter()

    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

    return ( 
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                columns={columns}
                data={data.items}
                onRowClick={(row) => {
                    router.push(`/agent/${row.id}`);
                }}
            />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
            />
            {data.items.length === 0 && (
                <EmptyState title="No Agents Found" description="Create a new agent to join your meetings. Each agent will follow your instructions and can interact with participation during the call." />
            )}
        </div>
    )

}


export const AgentsViewLoading= () => {
    return (
        <Loading title='Loading Agents' description='Please wait while we load the agents.' />
    )
}

export const AgentsViewError = () => {
    return (
        <Error
            title="Error loading agents"
            description="Please try again later."
        />
    )
}


// useSuspenseQuery has allready fetched the data so we can use it directly without checking for loading or error states

// useSuspense will not give undefined data, it will throw an error if the data is not available, so we can use it directly in the component without checking for loading or error states