"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loading } from "@/components/Loading";
import { Error } from "@/components/ErrorState";
import { DataTable } from "@/components/DataTable";
import {columns} from "@/modules/meetings/ui/components/Columns";
import { EmptyState } from "@/components/EmptyState";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { DataPagination } from "@/components/DataPagination";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";


export const MeetingsView=()=>{

    const trpc= useTRPC();
    const router=useRouter();
    const searchParams = useSearchParams();  // useSearchParams is a hook that returns the current URL search parameters
    const [filters, setFilters] =useMeetingsFilter();



    useEffect(() => {
        const isSocialSignIn = searchParams.get("social_signin");

        if (isSocialSignIn) {
            toast.success("Signed in successfully!", {
            id: "social-signin-success",
            duration: 5000,
        });

        // ✅ Clean the URL: remove ?social_signin=true
        const url = new URL(window.location.href);
        url.searchParams.delete("social_signin");
        router.replace(url.pathname); // Keeps you on same page, cleans URL
        }
    }, [searchParams, router]);




    const { data } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({
            ...filters,
        })
    );


    return (
        <div className="flex-1 pb-4 md:px-8 px-4 flex flex-col gap-y-4">
            <DataTable data={data.items}
            columns={columns}
            onRowClick={(row) => {
                router.push(`/meetings/${row.id}`);
            }}/>

            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({ ...filters, page })}
            />

        {data.items.length === 0 && (
        <EmptyState title="No Meetings Found" description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas and interact with participants during the call." />
                    )}

        </div>
    );
}



export const MeetingsViewLoading = () => {
    return (
        <Loading title='Loading Meetings' description='Please wait while we load the meetings.' />
    )
}

export const MeetingsViewError = () => {
    return (
        <Error
            title="Error loading meetings"
            description="Please try again later."
        />
    )
}