"use client"
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { generatedAvatar } from '@/components/generated-avatar'
import { ChevronDown, CreditCardIcon, LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'



export const DashboardUserButton = () => {

    const router=useRouter()
    const {data,isPending}=authClient.useSession()
    if(isPending || !data?.user){
        return null
    } 

    const handleLogout =  () => {
         authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.push("/sign-in")
            }
        })
        
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">


            {data.user.image ? (
                <Avatar>
                    <AvatarImage src={data.user.image} alt={data.user.name || "User Profile"} />
                    <AvatarFallback className="bg-white/10 text-white">
                        {data.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
            ) : (
                generatedAvatar({
                    seed: data.user.name || "User",
                    variant: "bigEarsNeutral",  // or "botttsNeutral"
                    className: "size-9 mr-3"
                })
            )}


            <div className='flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0'>
                <p className="text-sm truncate w-full">
                    {data.user.name}
                </p>

                <p className="text-xs w-full truncate">
                    {data.user.email}
                </p>
            </div>
            <ChevronDown className='size-4 shrink-0' />
            </DropdownMenuTrigger>

            
            <DropdownMenuContent align='end' side='right' className='w-72'>
                <DropdownMenuLabel >
                <div className='flex flex-col gap-1'>
                    <span className='font-medium truncate'>{data.user.name}</span>
                    <span className='text-xs font-normal text-muted-foreground truncate'>{data.user.email}</span>
                </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />


                <DropdownMenuItem className='cursor-pointer flex justify-between items-center'>
                    Billing 
                    <CreditCardIcon className='ml-auto size-4' />
                </DropdownMenuItem>

                <DropdownMenuItem className='cursor-pointer flex justify-between items-center' onClick={handleLogout}>
                    Logout 
                    <LogOutIcon className='ml-auto size-4' />
                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>

    )
}