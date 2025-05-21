'use client'
import {newPasswordSchema, type TypeNewPasswordSchema} from "@/schemas/auth/new-password.schema";
import {type FC, useState} from "react";
import {useTranslations} from "next-intl";
import {useParams, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {type NewPasswordMutation, useNewPasswordMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import AuthWrapper from "@/components/features/auth/AuthWrapper";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Button} from "@/components/ui/common/button";



type TokenProp = {
    token: string;
}

interface Props {
    className?: string;
}

const NewPasswordForm: FC<Props> = ({className}) => {
    const t = useTranslations('auth.newPassword');
    const router = useRouter();
    const params = useParams<TokenProp>();

    const [isShowTwoFactor, setIsShowTwoFactor] = useState<boolean>(false)

    const form = useForm<TypeNewPasswordSchema>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: '',
            passwordRepeat: ''
        }
    });
    const [newPassword, {loading: isLoadingNewPassword}] = useNewPasswordMutation({
        onCompleted(data: NewPasswordMutation) {
            toast.success(t('successMessage'));
            router.push('/account/login')

        },
        onError() {
            toast.error(t('errorMessage'));
        }
    });

    const {isValid} = form.formState;

    function onSubmit(data: TypeNewPasswordSchema) {
        newPassword({
            variables: {
                data: {
                    ...data,
                    token: params.token
                }
            }
        })
    }

    return (
        <AuthWrapper
            className={className}
            heading={t('heading')}
            backButtonHref={'/account/login'}
            backButtonLabel={t('backButtonLabel')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={'grid gap-y-3'}>

                    <FormField name={'password'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel>{t('passwordLabel')}</FormLabel>
                                       <FormControl>
                                           <Input placeholder={'********'}
                                                  type={'password'}
                                                  disabled={isLoadingNewPassword} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('passwordDescription')}
                                       </FormDescription>
                                   </FormItem>)
                               }
                    />
                    <FormField name={'passwordRepeat'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem>
                                       <FormLabel>{t('passwordRepeatLabel')}</FormLabel>
                                       <FormControl>
                                           <Input placeholder={'********'}
                                                  type={'password'}
                                                  disabled={isLoadingNewPassword} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('passwordRepeatLabel')}
                                       </FormDescription>
                                   </FormItem>)
                               }
                    />


                    <Button className={'w-full mt-2'}
                            disabled={!isValid || isLoadingNewPassword}
                    >
                        {t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    );
};

export default NewPasswordForm;
