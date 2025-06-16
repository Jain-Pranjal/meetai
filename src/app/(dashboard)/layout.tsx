// we are making this layout page so that it will look same in the dashboard 

import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from '@/modules/dashboard/ui/components/DashboardSidebar';
import { DashboardNavbar } from '@/modules/dashboard/ui/components/DashboardNavbar';
interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
        <DashboardSidebar/>
        <main className='flex flex-col h-screen w-screen bg-muted'>
          <DashboardNavbar />
          {children}
        </main>
    </SidebarProvider>
  )
}

export default Layout



// the sidebarprovider is used to provide the context to the components inside the sidebar 
