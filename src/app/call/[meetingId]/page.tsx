import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { CallView } from "@/modules/call/ui/views/CallView";


interface Props{
    params: Promise<{
        meetingId: string;
    }>
}

// we have use the meetingId as the params beause in the procedure we use the same meetingid to make the stream call so both are the same as meeting is the call only


const Page=async ({params}:Props) => {

    const {meetingId}=await params;

    
    const session = await auth.api.getSession({
        headers: await headers() 
    })
    
    if(!session) {
        redirect("/sign-in");
    }

    const queryClient=getQueryClient();
      void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({
          id: meetingId
      }));
    
    

  return (
    <>

    <HydrationBoundary state={dehydrate(queryClient)}>
      <CallView meetingId={meetingId}/>
    </HydrationBoundary>

    </>
  )
}


export default Page;


