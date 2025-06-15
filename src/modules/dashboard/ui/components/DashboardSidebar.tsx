"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { BotIcon, VideoIcon,StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import  {DashboardUserButton}  from "./DashboardUserButton"


const firstSection=[
    {
        icon:VideoIcon,
        label:"Meetings",
        href:"/meetings"
    },
    {
        icon:BotIcon,
        label:"Agent",
        href:"/agent"
    }
]

const secondSection=[
    {
        icon:StarIcon,
        label:"Upgrade",
        href:"/upgrade"
    }
]


export const DashboardSidebar = () => {
    const pathname=usePathname()
        return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarContent className="">
            {/* Logo at the top of sidebar */}
            <div className="flex justify-center items-center p-4 mb-4">
                <Link href="/">
                    <div className="flex items-center">
                        <Image 
                        src="/appLogo.svg" 
                        alt="MeetAI Logo" 
                        className="h-8 mr-2"
                        width={32}
                        height={32}
                        priority
                        />
                        <span className="font-bold text-lg">Meet AI</span>
                    </div>
                </Link>
            </div>

            <SidebarGroup>
                <SidebarMenu>
                {firstSection.map((item) => (
                    <SidebarMenuItem key={item.label}>
                    <Link href={item.href}>
                        <SidebarMenuButton 
                        className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                            pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50")}
                            isActive={pathname === item.href}>
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroup>
 

            <div className="px-4 py-2">
                <Separator className="opacity-70 h-[2px] bg-slate-300 dark:bg-slate-600 my-2" />
            </div>

            
            <SidebarGroup>
                <SidebarGroupLabel>Plan</SidebarGroupLabel>
                <SidebarGroupContent>
                <SidebarMenu>
                    {secondSection.map((item) => (
                    <SidebarMenuItem key={item.label}>
                        <Link href={item.href}>
                        <SidebarMenuButton>
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.label}
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            </SidebarContent>



            {/* showing the user information */}
            <SidebarFooter className="p-3 w-full">
                <DashboardUserButton />
            </SidebarFooter>

        </Sidebar>
    )
}
