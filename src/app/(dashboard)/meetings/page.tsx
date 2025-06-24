//SERVER COMPONENT


import React, { Suspense } from 'react'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from "react-error-boundary";
import { MeetingsViewLoading,MeetingsViewError,MeetingsView } from "@/modules/meetings/ui/views/MeetingsView";
import { MeetingListHeader } from '@/modules/meetings/ui/components/MeetingsListHeader';
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'



const page = async() => {


  const session = await auth.api.getSession({
        headers: await headers() 
    })
    
    if(!session) {
      redirect("/sign-in");
    }
  

  const queryClient=getQueryClient();
  // prefetching the data for the meetings view
  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({ }));



  return (
    <>
    <MeetingListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsViewLoading />}>
        <ErrorBoundary fallback={<MeetingsViewError />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>

    </>
  )
}

export default page;