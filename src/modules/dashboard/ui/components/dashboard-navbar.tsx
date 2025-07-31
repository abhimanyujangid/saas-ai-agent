"use client"

// UI Component
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "./dashboard-command";

// Icons
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";


export const DashboardNavbar = () => {
    const { toggleSidebar , isMobile, state } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
           if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", down);
        return () => {
            document.removeEventListener("keydown", down);
        }; 
    }, []);


    return (
        <>   
        <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
        <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        <Button className="size-9" variant="outline" aria-label="Toggle sidebar" onClick={toggleSidebar} >
         {(state === "collapsed" || isMobile) ? <PanelLeftIcon className="size-4" /> : <PanelLeftCloseIcon className="size-4" />}
        </Button>
        <Button 
        variant="outline" 
        size='sm' 
        className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
        onClick={() => setCommandOpen((prev) => !prev)}>
            <SearchIcon />
            <span className="ml-2">Search</span>
            <kbd className="ml-auto  items-center inline-flex gap-1 bg-muted text-xs font-normal rounded px-1">
                <span className="text-xs">&#8984;</span><span className="text-xs">K</span>
            </kbd>
        </Button>
        </nav>
        </>
    );
}