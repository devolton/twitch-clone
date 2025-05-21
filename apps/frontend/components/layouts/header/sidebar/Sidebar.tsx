'use client'
import {FC} from "react";
import {useSidebar} from "@/hooks/useSidebar";
import {cn} from "@/lib/utils";
import SidebarHeader from "@/components/layouts/header/sidebar/SidebarHeader";


const Sidebar: FC = () => {
    const {isCollapsed} = useSidebar();
    return (
        <aside className={
            cn('fixed left-0 z-50 mt-[75px] h-full flex flex-col border-r border-border bg-card transition-all duration-100 ease-in-out',
                isCollapsed ? 'w-16' : 'w-64',
            )
        }>
            <SidebarHeader/>
        </aside>
    );
};

export default Sidebar;
