import {getQueryClient,trpc} from "@/trpc/server"
import { HydrationBoundary ,dehydrate} from "@tanstack/react-query"
import React, { Suspense } from 'react'
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ErrorBoundary } from "react-error-boundary";
import {UpgradeViewLoading,UpgradeViewError,UpgradeView} from "@/modules/premium/ui/views/UpgradeView";



const Page = async () => {


    const session = await auth.api.getSession({
        headers: await headers() 
    })
    
    if(!session) {
    redirect("/sign-in");
    }



    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(
        trpc.premium.getCurrentSubscription.queryOptions()
    );

    void queryClient.prefetchQuery(
        trpc.premium.getProducts.queryOptions()
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<UpgradeViewLoading />}>
                <ErrorBoundary fallback={<UpgradeViewError />}>
                    <UpgradeView />
                </ErrorBoundary>
                </Suspense>
        </HydrationBoundary>
    );
};


export default Page;