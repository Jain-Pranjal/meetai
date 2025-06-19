// it is the server component for the agent view

import React, { Suspense } from 'react'
import { AgentView,AgentsViewError,AgentsViewLoading } from '@/modules/agents/ui/views/Agent-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from "react-error-boundary";
import { AgentListHeader } from '@/modules/agents/ui/components/AgentListHeader';
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

async function page() {

  const session = await auth.api.getSession({
      headers: await headers() 
  })
  
  if(!session) {
    redirect("/sign-in");
  }

  // we will use the server components to prefetch the data and then store in cache to get access to it in the client component
  const queryClient=getQueryClient()
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())



  return (
    <>
    <AgentListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <AgentView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>

    </>
  )
}

export default page


// it will hydrate the tanstack query cache so it will allready have the data when the client component is rendered reducing the loading time 


// we need to wrap in the hydration boundary so that the client component can access the data from the server component and we can use the data in the client component without fetching it again
