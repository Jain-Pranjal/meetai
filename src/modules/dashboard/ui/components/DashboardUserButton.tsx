
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { generatedAvatar } from '@/components/generated-avatar'
import { ChevronDown, CreditCardIcon, LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

export const DashboardUserButton = () => {
    const router = useRouter()
    const { isMobile, state } = useSidebar()
    const { data, isPending } = authClient.useSession()
    
    if (isPending || !data?.user) {
        return null
    } 

    const handleLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.push("/sign-in")
            }
        })
    }

    // we are using the state of the sidebar to determine if it is collapsed or not
    // state can be expanded and collapsed
    const isCollapsed = state === "collapsed"

    // User avatar component
    const UserAvatar = ({ className = "size-9" }: { className?: string }) => (
        data.user.image ? (
            <Avatar className={className}>
                <AvatarImage src={data.user.image} alt={data.user.name || "User Profile"} />
            </Avatar>
        ) : (
            generatedAvatar({
                seed: data.user.name || "User",
                variant: "bigEarsNeutral",  // or "botttsNeutral"
                className
            })
        )
    )



    // Menu items for dropdown
    const DropdownMenuItems = () => (
        <>
            <DropdownMenuItem className='cursor-pointer flex justify-between items-center'>
                Billing 
                <CreditCardIcon className='ml-auto size-4' />
            </DropdownMenuItem>

            <DropdownMenuItem 
                className='cursor-pointer flex justify-between items-center' 
                onClick={handleLogout}
            >
                Logout 
                <LogOutIcon className='ml-auto size-4 font-co' />
            </DropdownMenuItem>
        </>
    )

    // Menu items for drawer (mobile)
    const DrawerMenuItems = () => (
        <>
            <DrawerHeader>
                <DrawerTitle>{data.user.name}</DrawerTitle>
                <DrawerDescription>{data.user.email}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 space-y-2">
                <Button 
                    variant="outline"
                    className='w-full justify-between h-10 font-normal border border-muted-foreground/20'
                >
                    Billing 
                    <CreditCardIcon className='ml-auto size-4' />
                </Button>

                <Button 
                    variant="destructive" 
                    className='w-full justify-between h-10 font-normal border border-destructive/30'
                    onClick={handleLogout}
                >
                    Logout 
                    <LogOutIcon className='ml-auto size-4'/>
                </Button>
            </div>

            <DrawerFooter>
                <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                </DrawerClose>
            </DrawerFooter>
        </>
    )

// if it is on mobile then it will show the drawer otherwise it will show the dropdown menu on desktop

    // Mobile version using Drawer
    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="w-full h-auto p-2 justify-start hover:bg-white/10"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <UserAvatar />
                            <div className='flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0'>
                                <p className="text-sm font-medium truncate">
                                    {data.user.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {data.user.email}
                                </p>
                            </div>
                            <ChevronDown className='size-4 shrink-0' />
                        </div>
                    </Button>
                </DrawerTrigger>

                <DrawerContent>
                    <DrawerMenuItems />
                </DrawerContent>
            </Drawer>
        )
    }

    // Desktop version - handle both expanded and collapsed states
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    className={`w-full h-auto p-2 hover:bg-white/10 ${
                        isCollapsed ? 'justify-center' : 'justify-start'
                    }`}
                >
                    {isCollapsed ? (
                        // Collapsed state - only show avatar
                        <UserAvatar />
                    ) : (
                        // Expanded state - show full user info
                        <div className="flex items-center gap-3 w-full">
                            <UserAvatar />
                            <div className='flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0'>
                                <p className="text-sm font-medium truncate">
                                    {data.user.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {data.user.email}
                                </p>
                            </div>
                            <ChevronDown className='size-4 shrink-0' />
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
                align={isCollapsed ? 'center' : 'end'} 
                side={isCollapsed ? 'right' : 'right'} 
                className='w-72'
            >
                <DropdownMenuLabel>
                    <div className='flex flex-col gap-1'>
                        <span className='font-medium truncate'>{data.user.name}</span>
                        <span className='text-xs font-normal text-muted-foreground truncate'>
                            {data.user.email}
                        </span>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItems />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}