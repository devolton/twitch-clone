import React, {FC} from "react";
import {useTranslations} from "next-intl";
import SidebarItem, {RouteItem} from "@/components/layouts/header/sidebar/SidebarItem";
import {Banknote, DollarSign, Folder, Home, KeyRound, Medal, MessageSquare, Radio, Settings, Users} from "lucide-react";
import {RecommendedChannels} from "@/components/layouts/header/sidebar/RecommendedChannels";

interface Props {
    className?: string;
}

const UserNav: FC<Props> = ({className}) => {

    const t = useTranslations('layout.sidebar.userNav');

    const routes: RouteItem[] = [
        {
            label: t('home'),
            href: '/',
            icon: Home,
        },
        {
            label: t('categories'),
            href: '/category',
            icon: Folder,
        },
        {
            label: t('streams'),
            href: '/streams',
            icon: Radio,
        },

    ]
    return (
        <div className={'space-y-2 pt-4 px-2 lg:pt-0'}>
            {
                routes.length > 0 && routes.map((route, index) => (
                    <SidebarItem key={`route-${index}`} route={route}/>
                ))
            }
            <RecommendedChannels/>
        </div>
    );
};

export default UserNav;
