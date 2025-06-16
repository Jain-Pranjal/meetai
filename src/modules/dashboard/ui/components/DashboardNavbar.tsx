
// the useSidebar hook is used to get the state of the sidebar
"use client";
import { Button } from "@/components/ui/button";
import { PanelLeftCloseIcon, PanelLeftOpenIcon, SearchIcon, MenuIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "./DashboardCommand";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        const down = (event: KeyboardEvent) => {
            if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setCommandOpen((open) => !open);
            }
        }

        document.addEventListener("keydown", down);
        return () => {
            document.removeEventListener("keydown", down);
        };
    }, []);

    return (
        <>
            <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

            <nav className="flex items-center justify-between p-4 bg-white shadow-md">
                {/* Toggle button - now visible on all screen sizes */}
                <Button variant="ghost" onClick={toggleSidebar} size="sm">
                    {isMobile ? (
                        <MenuIcon className="h-4 w-4" />
                    ) : (
                        state === "collapsed" ? 
                        <PanelLeftOpenIcon className="h-4 w-4" /> : 
                        <PanelLeftCloseIcon className="h-4 w-4" />
                    )}
                </Button>

                {/* Search button - responsive width */}
                <Button 
                    variant="outline" 
                    className="h-9 w-full max-w-[240px] md:w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground" 
                    size="sm"
                    onClick={() => setCommandOpen((open) => !open)}
                >
                    <SearchIcon className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Search...</span>
                    <kbd className="ml-auto pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </nav>
        </>
    )
}
