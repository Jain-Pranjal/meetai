// it is the server component for the agent view

import React, { Suspense } from 'react'
import { AgentView,AgentsViewError,AgentsViewLoading } from '@/modules/agents/ui/views/Agent-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from "react-error-boundary";

async function page() {

  // we will use the server components to prefetch the data and then store in cache to get access to it in the client component
  const queryClient=getQueryClient()
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())



  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <AgentView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>

  )
}

export default page


// it will hydrate the tanstack query cache so it will allready have the data when the client component is rendered reducing the loading time 