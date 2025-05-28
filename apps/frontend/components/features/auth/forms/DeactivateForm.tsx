'use client'

import {useState} from "react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import AuthWrapper from "@/components/features/auth/AuthWrapper";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Button} from "@/components/ui/common/button";
import {useRouter} from "next/navigation";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/common/input-otp";
import {useAuth} from "@/hooks/useAuth";
import {type DeactivateAccountMutation, useDeactivateAccountMutation} from "@/graphql/generated/output";
import {deactivateSchema, type TypeDeactivateSchema} from "@/schemas/auth/deactivate.schema";


const DeactivateForm = () => {

    const t = useTranslations('auth.deactivate');
    const router = useRouter();

    const {exit} = useAuth();

    const [isShowConfirm, setIsShowConfirm] = useState<boolean>(false)

    const form = useForm<TypeDeactivateSchema>({
        resolver: zodResolver(deactivateSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const [deactivate, {loading: isLoadingDeactivate}] = useDeactivateAccountMutation({
        onCompleted(data: DeactivateAccountMutation) {
            if (data.deactivateAccount) {
                setIsShowConfirm(true);

            } else {
                exit();
                toast.success("successMessage")
                router.push('/')
            }
        },
        onError() {
            toast.error(t('errorMessage'));
        }
    });

    const {isValid} = form.formState;

    function onSubmit(data: TypeDeactivateSchema) {
        deactivate({
            variables: {
                data
            }
        })
    }

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonHref={'/dashboard/settings'}
            backButtonLabel={t('backButtonLabel')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={'grid gap-y-3'}>
                    {
                        isShowConfirm ?
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
                                <FormField name={'email'}
                                           control={form.control}
                                           render={({field}) => (
                                               <FormItem>
                                                   <FormLabel>{t('emailLabel')}</FormLabel>
                                                   <FormControl>
                                                       <Input placeholder={'john.doe@example.com'}
                                                              disabled={isLoadingDeactivate} {...field}/>
                                                   </FormControl>
                                                   <FormDescription>
                                                       {t('emailDescription')}
                                                   </FormDescription>
                                               </FormItem>)
                                           }
                                />

                                <FormField name={'password'}
                                           control={form.control}
                                           render={({field}) => (
                                               <FormItem>
                                                   <FormLabel>{t('passwordLabel')}</FormLabel>
                                                   <FormControl>
                                                       <Input type={'password'}
                                                              placeholder={'*******'}
                                                              disabled={isLoadingDeactivate}
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
                            disabled={!isValid || isLoadingDeactivate}
                    >
                        {t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    );
};

export default DeactivateForm;
