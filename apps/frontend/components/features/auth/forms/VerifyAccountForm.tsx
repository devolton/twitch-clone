'use client'

import {type FC, useEffect} from "react";
import {useTranslations} from "next-intl";
import {useRouter, useSearchParams} from "next/navigation";
import {useVerifyAccountMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import AuthWrapper from "@/components/features/auth/AuthWrapper";
import {Loader} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";

interface Props {
    className?: string;
}

const VerifyAccountForm: FC<Props> = ({className}) => {
    const t = useTranslations('auth.verify');
    const router = useRouter();
    const {auth} = useAuth();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const [verify] = useVerifyAccountMutation({
        onCompleted() {
            auth();
            toast.success(t('successMessage'))
            router.push('/dashboard/settings')
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    });
    useEffect(() => {
        verify({
            variables: {
                data: {
                    token
                }
            }
        });
    }, [token]);

    return (
        <AuthWrapper
            heading={t('heading')}
        >
            <div className={'flex justify-center'}>
                <Loader className={'size-8 animate-spin'}/>
            </div>
        </AuthWrapper>
    );
};

export default VerifyAccountForm;
