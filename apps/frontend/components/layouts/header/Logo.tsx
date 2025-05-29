'use client'
import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {useTranslations} from "next-intl";
import LogoImage from "@/components/images/Logo.image";


const Logo = () => {
    const t = useTranslations('layout.header.logo')
    return (
        <Link href={'/'} className={'items-center flex gap-x-4 transition-opacity hover:opacity-75'}>
            <LogoImage/>
            <div className={'hidden leading-tight lg:block'}>
                <h2 className={'text-lg font-semibold tracking-wider text-foreground'}>DevoltonStream</h2>
                <p className={'text-muted-foreground text-sm'}>{t('platform')}</p>
            </div>

        </Link>
    );
};

export default Logo;