'use client'

import {useTranslations} from "next-intl";
import {useCurrent} from "@/hooks/useCurrent";
import WrapperTotpSkeleton from "@/components/ui/elements/skeletons/WrapperTotpSkeleton";
import CardContainer from "@/components/ui/elements/CardContainer";
import EnabledTotp from "@/components/features/user/account/totp/EnabledTotp";
import DisableTotp from "@/components/features/user/account/totp/DisableTotp";

const WrapperTotp = () => {
    const t = useTranslations('dashboard.settings.account.twoFactor');
    const {user, isLoadingProfile} = useCurrent();
    return isLoadingProfile ? <WrapperTotpSkeleton/> :
        <CardContainer heading={t('heading')}
                       description={t('description')}
                       rightContent={
                           <div className={'gap-x-4 flex items-center'}>
                               {
                                   !user?.isTotpEnabled ? <EnabledTotp/> : <DisableTotp/>
                               }
                           </div>
                       }/>
            };

export default WrapperTotp;