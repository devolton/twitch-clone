'use client'

import {useTranslations} from "next-intl";
import {useCurrent} from "@/hooks/useCurrent";
import {useDisableTotpMutation, useEnableTotpMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import ConfirmModal from "@/components/ui/elements/ConfirmModal";
import {Button} from "@/components/ui/common/button";

const DisableTotp = () => {
    const t = useTranslations('dashboard.settings.account.twoFactor.disable');
    const {refetch} = useCurrent();

    const [disable, {loading: isLoadingDisable}] = useDisableTotpMutation({
        onCompleted() {
            refetch();
            toast.success('successMessage')
        },
        onError() {
            toast.error('errorMessage')
        }
    })
    return (
        <ConfirmModal heading={t('heading')} message={t('message')} onConfirm={() => disable()}>
            <Button variant={'secondary'}
                    disabled={isLoadingDisable}>
                {t('trigger')}
            </Button>
        </ConfirmModal>
    );
};

export default DisableTotp;