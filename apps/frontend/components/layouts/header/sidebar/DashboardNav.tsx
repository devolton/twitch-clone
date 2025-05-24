import React from 'react';
import {useTranslations} from "next-intl";
import SidebarItem, {type RouteItem} from "@/components/layouts/header/sidebar/SidebarItem";
import {Banknote, DollarSign, KeyRound, Medal, MessageSquare, Settings, Users} from "lucide-react";

const DashboardNav = () => {
    const t = useTranslations('layout.sidebar.dashboardNav');

    const routes: RouteItem[] = [
        {
            label: t('settings'),
            href: '/dashboard/settings',
            icon: Settings,
        },
        {
            label: t('keys'),
            href: '/dashboard/keys',
            icon: KeyRound,
        },
        {
            label: t('chatSettings'),
            href: '/dashboard/chat',
            icon: MessageSquare,
        },
        {
            label: t('followers'),
            href: '/dashboard/followers',
            icon: Users,
        },
        {
            label: t('sponsors'),
            href: '/dashboard/sponsors',
            icon: Medal,
        },
        {
            label: t('premium'),
            href: '/dashboard/plans',
            icon: DollarSign,
        },
        {
            label: t('transactions'),
            href: '/dashboard/transactions',
            icon: Banknote,
        },

    ]
    return (
        <div className={'space-y-2 pt-4 px-2 lg:pt-0'}>
            {
                routes.length > 0 && routes.map((route, index) => (
                    <SidebarItem key={`route-${index}`} route={route}/>
                ))
            }

        </div>
    );
};

export default DashboardNav;