'use client'
import {FC} from "react";
import {useSidebar} from "@/hooks/useSidebar";
import {cn} from "@/lib/utils";
import SidebarHeader from "@/components/layouts/header/sidebar/SidebarHeader";
import {usePathname} from "next/navigation";
import DashboardNav from "@/components/layouts/header/sidebar/DashboardNav";
import UserNav from "@/components/layouts/header/sidebar/UserNav";


const Sidebar: FC = () => {
    const {isCollapsed} = useSidebar();
    const pathname = usePathname();

    const isDashboardPage = pathname.includes('/dashboard');


    return (
        <aside className={
            cn('fixed left-0 z-50 mt-[75px] h-full flex flex-col border-r border-border bg-card transition-all duration-100 ease-in-out',
                isCollapsed ? 'w-16' : 'w-64',
            )
        }>
            <SidebarHeader/>
            {isDashboardPage ? <DashboardNav/> : <UserNav/>}
        </aside>
    );
};

export default Sidebar;
