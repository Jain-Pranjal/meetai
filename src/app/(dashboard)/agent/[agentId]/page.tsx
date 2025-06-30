// SERVER COMPONENT so we can do prefetching and then store in cache to access individual agent data

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AgentIdView } from "@/modules/agents/ui/views/AgentIdView";
import {
  AgentIdViewError,
  AgentIdViewLoading,
} from "@/modules/agents/ui/views/AgentIdView";

interface Props {
  params: Promise<{ agentId: string }>;
}

// Params are the dynamic segments of the URL, in this case, the agentId. and in next js params are the promise so we need to await them 

const Page = async ({ params }: Props) => {
  // getting the agentId from the params
  const { agentId } = await params;

  // prefetch the agent data for the given agentId and saving to the cache
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({
      id: agentId,
    })
  );

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


// here we have pass the agentId as the props so it will be treated as the simple props in the idPage view so we dont need to make a promise as it is not a params now . In next js we need to make the params as a promise and await them as well but props just needs the type schema 
