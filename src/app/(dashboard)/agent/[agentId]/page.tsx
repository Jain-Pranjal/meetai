// SERVER COMPONENT so we can do prefetching and then store in cache 
// to access individual agent data

import { getQueryClient,trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from "react-error-boundary";
import { AgentIdView } from "@/modules/agents/ui/views/AgentIdView";
import { AgentIdViewError,AgentIdViewLoading } from "@/modules/agents/ui/views/AgentIdView";



interface Props{
    params:Promise<{ agentId: string }>
}

const Page=async ({ params }: Props) => {

    // getting the agentId from the params
    const { agentId } = await params;

    // prefetch the agent data for the given agentId and saving to the cache
    const queryClient=getQueryClient()
      void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({
        id: agentId
    }));



    return (
       <HydrationBoundary state={dehydrate(queryClient)}>
             <Suspense fallback={<AgentIdViewLoading />}>
             <ErrorBoundary fallback={<AgentIdViewError />}>
                <AgentIdView agentId={agentId} />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
    );
};

export default Page;