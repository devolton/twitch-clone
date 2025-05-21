'use client'

import {FC, useState} from "react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginMutation, useLoginMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {loginSchema, TypeLoginSchema} from "@/schemas/auth/login.schema";
import AuthWrapper from "@/components/features/auth/AuthWrapper";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Button} from "@/components/ui/common/button";
import {useRouter} from "next/navigation";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/common/input-otp";
import Link from "next/link";
import {useAuth} from "@/hooks/useAuth";

interface Props {
    className?: string;
}

const LoginAccountForm: FC<Props> = ({className}) => {

    const t = useTranslations('auth.login');
    const router = useRouter();

    const {auth} = useAuth();

    const [isShowTwoFactor, setIsShowTwoFactor] = useState<boolean>(false)

    const form = useForm<TypeLoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: '',
            password: ''
        }
    });
    const [login, {loading: isLoadingLogin}] = useLoginMutation({ //first -method name, second - operation status props
        onCompleted(data: LoginMutation) {
            if (data.login.user) {
                setIsShowTwoFactor(true);

            } else {
                auth();
                toast.success("successMessage")
                router.push('/dashboard/settings')
            }
        },
        onError() {
            toast.error(t('errorMessage'));
        }
    });

    const {isValid} = form.formState;

    function onSubmit(data: TypeLoginSchema) {
        login({variables: {data}})
    }

    return (
        <AuthWrapper
            className={className}
            heading={t('heading')}
            backButtonHref={'/account/create'}
            backButtonLabel={t('backButtonLabel')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={'grid gap-y-3'}>
                    {
                        isShowTwoFactor ?
                            <FormField name={'pin'}
                                       control={form.control}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel>{t('pinLabel')}</FormLabel>
                                               <FormControl>
                                                   <InputOTP maxLength={6} {...field}>
                                                       <InputOTPGroup>
                                                           <InputOTPSlot index={0}/>
                                                           <InputOTPSlot index={1}/>
                                                           <InputOTPSlot index={2}/>
                                                           <InputOTPSlot index={3}/>
                                                           <InputOTPSlot index={4}/>
                                                           <InputOTPSlot index={5}/>
                                                       </InputOTPGroup>

                                                   </InputOTP>
                                               </FormControl>
                                               <FormDescription>
                                                   {t('pinLabel')}
                                               </FormDescription>
                                           </FormItem>)
                                       }
                            />
                            :
                            <>
                                <FormField name={'login'}
                                           control={form.control}
                                           render={({field}) => (
                                               <FormItem>
                                                   <FormLabel>{t('loginLabel')}</FormLabel>
                                                   <FormControl>
                                                       <Input placeholder={'johndoe'}
                                                              disabled={isLoadingLogin} {...field}/>
                                                   </FormControl>
                                                   <FormDescription>
                                                       {t('loginDescription')}
                                                   </FormDescription>
                                               </FormItem>)
                                           }
                                />

                                <FormField name={'password'}
                                           control={form.control}
                                           render={({field}) => (
                                               <FormItem>
                                                   <div className={'flex items-center justify-between'}>
                                                       <FormLabel>{t('passwordLabel')}</FormLabel>
                                                       <Link href={'/account/recovery'}
                                                             className={'ml-auto text-sm inline-block'}>
                                                           {t('forgotPassword')}
                                                       </Link>
                                                   </div>
                                                   <FormControl>
                                                       <Input type={'password'}
                                                              placeholder={'*******'}
                                                              disabled={isLoadingLogin}
                                                              {...field}/>
                                                   </FormControl>
                                                   <FormDescription>
                                                       {t('passwordDescription')}
                                                   </FormDescription>
                                               </FormItem>)
                                           }
                                />
                            </>
                    }
                    <Button className={'w-full mt-2'}
                            disabled={!isValid || isLoadingLogin}
                    >
                        {t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    );
};

export default LoginAccountForm;
