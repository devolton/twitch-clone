'use client'

import {type FC, useState} from "react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useResetPasswordMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {resetPasswordSchema, type TypeResetPasswordSchema} from "@/schemas/auth/reset-password.schema";
import AuthWrapper from "@/components/features/auth/AuthWrapper";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/common/alert";
import {CircleCheck} from "lucide-react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Button} from "@/components/ui/common/button";

interface Props {
    className?: string;
}

const ResetPasswordFrom: FC<Props> = ({className}) => {

    const t = useTranslations('auth.resetPassword');;
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const form = useForm<TypeResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: ''
        }
    });
    const [reset, {loading: isLoadingReset}] = useResetPasswordMutation({ //first -method name, second - operation status props
        onCompleted() {
            setIsSuccess(true)
        },
        onError() {
            toast.error(t('errorMessage'));
        }
    });

    const {isValid} = form.formState;

    function onSubmit(data: TypeResetPasswordSchema) {
        reset({variables: {data}})
    }
    return (
        <AuthWrapper
            className={className}
            heading={t('heading')}
            backButtonHref={'/account/login'}
            backButtonLabel={t('backButtonLabel')}>
            {
                isSuccess ?
                    <Alert>
                        <CircleCheck className={'size-4'}/>
                        <AlertTitle>{t('successAlertTitle')}</AlertTitle>
                        <AlertDescription>{t('successAlertDescription')}</AlertDescription>
                    </Alert>
                    :
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={'grid gap-y-3'}>
                            <FormField name={'email'}
                                       control={form.control}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel>{t('emailLabel')}</FormLabel>
                                               <FormControl>
                                                   <Input placeholder={'johndoe@gmail.com'}
                                                          disabled={isLoadingReset} {...field}/>
                                               </FormControl>
                                               <FormDescription>
                                                   {t('emailDescription')}
                                               </FormDescription>
                                           </FormItem>)
                                       }
                            />

                            <Button className={'w-full mt-2'} disabled={!isValid || isLoadingReset}>{t('submitButton')}</Button>
                        </form>
                    </Form>
            }
        </AuthWrapper>
    );
};

export default ResetPasswordFrom;
