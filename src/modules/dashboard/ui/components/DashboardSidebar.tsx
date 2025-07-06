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
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { BotIcon, VideoIcon, StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { DashboardUserButton } from "./DashboardUserButton"
import { DashboardTrial } from "./DashboardTrial"

const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings"
    },
    {
        icon: BotIcon,
        label: "Agent",
        href: "/agent"
    }
]

const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade"
    }
]

export const DashboardSidebar = () => {
    const pathname = usePathname()
    const { state, isMobile } = useSidebar()
    const isCollapsed = state === "collapsed" && !isMobile // Don't collapse on mobile

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarContent>
                {/* Logo at the top of sidebar */}
                <div className={cn(
                    "flex p-4 mb-4 transition-all duration-200",
                    isCollapsed ? "justify-center" : "justify-center"
                )}>
                    <Link href="/" className={cn(
                        "flex items-center gap-2",
                        isCollapsed ? "justify-center" : "justify-center"
                    )}>
                        <Image 
                            src="/appLogo.svg" 
                            alt="MeetAI Logo" 
                            className="h-8 w-8 shrink-0"
                            width={32}
                            height={32}
                            priority
                        />
                        {(isMobile || !isCollapsed) && (
                            <span className="font-bold text-lg whitespace-nowrap">
                                Meet AI
                            </span>
                        )}
                    </Link>
                </div>

                <SidebarGroup>
                    <SidebarMenu>
                        {firstSection.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton 
                                    asChild
                                    className={cn(
                                        "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                        pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50"
                                    )}
                                    isActive={pathname === item.href}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Show separator on mobile or when not collapsed on desktop */}
                {(isMobile || !isCollapsed) && (
                    <div className="px-4">
                        <Separator className="opacity-70 h-[2px] bg-slate-300 dark:bg-slate-600 my-2" />
                    </div>
                )}

                <SidebarGroup>
                    {/* Show group label on mobile or when not collapsed on desktop */}
                    {(isMobile || !isCollapsed) && <SidebarGroupLabel>Plan</SidebarGroupLabel>}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            {/* User information in footer */}
            <SidebarFooter className="p-3">
                <DashboardTrial />
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
}



// also we are storing the state of the sidebar so that it will be stored in the cookies