'use client'
import React from 'react';
import {useTranslations} from "next-intl";
import {usePathname} from "next/navigation";
import {useSidebar} from "@/hooks/useSidebar";
import Hint from "@/components/ui/elements/Hint";
import {Button} from "@/components/ui/common/button";
import {ArrowLeftFromLine, ArrowRightFromLine} from "lucide-react";

const SidebarHeader = () => {
    const t = useTranslations('layout.header.sidebar.header');
    const pathname = usePathname();
    const {isCollapsed, open, close} = useSidebar();
    const label = isCollapsed ? t('expand') : t('collapse');

    return isCollapsed ? (
        <div className="mb-6 hidden w-full items-center justify-center pt-4 lg:flex">
            <Hint label={label} side={'right'} asChild>
                <Button variant={'ghost'}
                        size={'icon'}
                        onClick={() => open()}
                >
                    <ArrowRightFromLine className={'size-4'}/>
                </Button>
            </Hint>
        </div>

    ) : (
        <div className={'mb-2 flex items-center justify-between p-3 pl-4 '}>
            <h2 className={'text-lg font-semibold text-foreground'}>{t('navigation')}</h2>
            <Hint label={label} side={'right'} asChild>

                <Button variant={'ghost'}
                        size={'icon'}
                        onClick={() => close()}
                >
                    <ArrowLeftFromLine className={'size-4'}/>
                </Button>
            </Hint>
        </div>
    )
};

export default SidebarHeader;