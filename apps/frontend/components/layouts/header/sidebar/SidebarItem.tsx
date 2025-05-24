'use client'

import {type FC} from "react";
import {type LucideIcon} from "lucide-react";
import {usePathname} from "next/navigation";
import {useSidebar} from "@/hooks/useSidebar";
import Hint from "@/components/ui/elements/Hint";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/common/button";
import Link from "next/link";

export interface RouteItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

interface Props {
    route: RouteItem;
}

const SidebarItem: FC<Props> = ({route}) => {

    const pathname = usePathname();
    const {isCollapsed} = useSidebar();
    const isActive = pathname === route.href;


    return isCollapsed ?
        <Hint side={'right'} label={route.label} asChild>
            <Button className={cn('h-11 w-full justify-center', isActive && 'bg-accent')}
                    variant={'ghost'} asChild>
                <Link href={route.href}>
                    <route.icon className={'mr-0 size-5'}/>
                </Link>

            </Button>
        </Hint>
        :
        <Button className={cn('h-11 w-full justify-start', isActive && 'bg-accent')}
                variant={'ghost'} asChild>
            <Link href={route.href} className={'flex items-center gap-x-4'}>
                <route.icon className={'mr-0 size-5'}/>
                {route.label}
            </Link>

        </Button>
};

export default SidebarItem;
