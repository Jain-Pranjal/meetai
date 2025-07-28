import { CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "@/components/ui/command"
import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { CommandEmpty, CommandGroup } from "cmdk"
import { generatedAvatar } from "@/components/generated-avatar"


interface Props{
    open:boolean,
    setOpen:Dispatch<SetStateAction<boolean>>
}



export const DashboardCommand = ({ open, setOpen }: Props) => {

    const router = useRouter();
    const [search,setSearch]=useState("");

    const trpc = useTRPC();

    const meetings=useQuery(trpc.meetings.getMany.queryOptions({
        pageSize: 100,
        search
    }));

    const agents=useQuery(trpc.agents.getMany.queryOptions({
        pageSize: 100,
        search
    }));


    return (
        <CommandResponsiveDialog 
        shouldFilter={false}
        open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder="Find a meeting or agent..."
                className="w-[300px] md:w-[400px] lg:w-[500px] max-w-md"
                value={search}
                onValueChange={setSearch}
            />
            <CommandList>
                <CommandGroup heading="Meetings">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm flex justify-center items-center">
                            No meetings found.
                        </span>
                    </CommandEmpty>

                    {meetings.data?.items.map((meeting) => (
                        <CommandItem
                            key={meeting.id}
                            onSelect={() => {
                                router.push(`/meetings/${meeting.id}`);
                                setOpen(false);
                            }}
                        >
                            {meeting.name}
                        </CommandItem>
                    ))}

                </CommandGroup>
                
                <CommandGroup heading="Agents">
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm flex justify-center items-center">
                            No agents found.
                        </span>
                    </CommandEmpty>

                    {agents.data?.items.map((agent) => (
                        <CommandItem
                            key={agent.id}
                            onSelect={() => {
                                router.push(`/agent/${agent.id}`);
                                setOpen(false);
                            }}
                        >

                            {generatedAvatar({
                            seed: agent.name || "User",
                            variant: "botttsNeutral",
                            className: "size-4"
                        })}

                            {agent.name}
                        </CommandItem>
                    ))}

                </CommandGroup>
               
            </CommandList>
        </CommandResponsiveDialog>
    )
}