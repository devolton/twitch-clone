'use client'
import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {useTranslations} from "next-intl";


const Logo = () => {
    const t = useTranslations('layout.header.logo')
    return (
        <Link href={'/'} className={'items-center flex gap-x-4 transition-opacity hover:opacity-75'}>
            <Image src={'/images/logo.svg'} alt={'DevoltonStream'} width={35} height={35}/>
            <div className={'hidden leading-tight lg:block'}>
                <h2 className={'text-lg font-semibold tracking-wider text-foreground'}>DevoltonStream</h2>
                <p className={'text-muted-foreground text-sm'}>{t('platform')}</p>
            </div>

        </Link>
    );
};

export default Logo;