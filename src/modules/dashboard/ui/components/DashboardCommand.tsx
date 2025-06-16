import { CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "@/components/ui/command"
import { Dispatch, SetStateAction } from "react"

interface Props{
    open:boolean,
    setOpen:Dispatch<SetStateAction<boolean>>
}



export const DashboardCommand = ({ open, setOpen }: Props) => {
    return (
        <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder="Find a meeting or agent"
                className="w-[300px] md:w-[400px] lg:w-[500px] max-w-md"
            />
            <CommandList>
                <CommandItem>
                    Test
                </CommandItem>
                <CommandItem>
                    Fake Meeting Item
                </CommandItem>
                <CommandItem>
                    Fake Agent Item
                </CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    )
}