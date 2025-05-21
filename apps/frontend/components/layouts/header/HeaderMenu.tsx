'use client'
import {FC} from "react";
import {useTranslations} from "next-intl";
import {useAuth} from "@/hooks/useAuth";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Button} from "@/components/ui/common/button";
import ProfileMenu from "@/components/layouts/header/ProfileMenu";

interface Props {
    className?: string;
}

const HeaderMenu: FC<Props> = ({className}) => {
    const t = useTranslations('layout.header.headerMenu');
    const {isAuthenticated} = useAuth();
    return (
        <div className={cn('ml-auto flex items-center gap-x-4', className)}>
            {isAuthenticated ?
                <ProfileMenu/>
                :
                <>
                    <Link href={'/account/login'}>
                        <Button variant={'secondary'}>
                            {t('login')}
                        </Button>
                    </Link>
                    <Link href={'/account/create'}>
                        <Button>
                            {t('register')}
                        </Button>
                    </Link>
                </>

            }
        </div>
    );
};

export default HeaderMenu;
