'use client'
import {useTranslations} from "next-intl";
import {useCurrent} from "@/hooks/useCurrent";
import {useEnableTotpMutation, useGenerateTotpSecretQuery} from "@/graphql/generated/output";
import {useForm, Form} from "react-hook-form";
import {enableTotpSchema, TypeEnableTotpSchema} from "@/schemas/user/enable-totp";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/common/Dialog";
import {Button} from "@/components/ui/common/button";
import {FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {InputOTP, InputOTPSlot} from "@/components/ui/common/input-otp";
import {toast} from "sonner";
import {useState} from "react";


const EnabledTotp = () => {
    const t = useTranslations('dashboard.setting.account.twoFactor.enable');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {refetch} = useCurrent();
    const {data, loading: isLoadingGenerate} = useGenerateTotpSecretQuery();
    const twoFactorAuth = data?.generateTotpSecret;

    const form = useForm<TypeEnableTotpSchema>({
        resolver: zodResolver(enableTotpSchema),
        defaultValues: {
            pin: ''
        }
    });

    const [enable, {loading: isLoadingEnable}] = useEnableTotpMutation({
        onCompleted() {
            refetch();
            setIsOpen(false);
            toast.success('successMessage')
        },
        onError() {
            toast.error('errorMessage')
        }
    })


    const {isValid} = form.formState;

    function onSubmit(data: TypeEnableTotpSchema) {
        enable({
            variables: {
                data: {
                    secret: twoFactorAuth?.secret ?? '',
                    pin:data.pin
                }
            }
        })
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>{t('trigger')}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('heading')}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                          className={'flex flex-col gap-4'}>
                        <div className={'flex flex-col items-center justify-center gap-4'}>
                        <span
                            className={'text-sm text-muted-foreground'}>{twoFactorAuth?.qrcodeUrl ? t('qrInstructions') : ''}</span>
                            <img src={twoFactorAuth?.qrcodeUrl} alt={'qr'} className={'rounded-lg'}/>
                        </div>
                        <div className={'flex flex-col gap-2'}>
                        <span className={'text-sm text-muted-foreground text-center'}>
                            {twoFactorAuth?.secret ? t('secretCodeLabel') + twoFactorAuth?.secret : ''}
                        </span>
                        </div>
                        <FormField name={'pin'}
                                   control={form.control}
                                   render={({field}) => (
                                       <FormItem className={'flex flex-col justify-center max-sm:items-center'}>
                                           <FormLabel>{t('pinLabel')}</FormLabel>
                                           <FormControl>
                                               <InputOTP maxLength={6} {...field}>
                                                   <InputOTPSlot index={0}/>
                                                   <InputOTPSlot index={1}/>
                                                   <InputOTPSlot index={2}/>
                                                   <InputOTPSlot index={3}/>
                                                   <InputOTPSlot index={4}/>
                                                   <InputOTPSlot index={5}/>
                                               </InputOTP>
                                           </FormControl>
                                           <FormDescription>{t('pinDescription')}</FormDescription>
                                       </FormItem>
                                   )}/>
                        <DialogFooter>
                            <Button type={'submit'}
                                    disabled={isValid || isLoadingGenerate || isLoadingEnable}>
                                {t('submitButton')}
                            </Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>)
}
export default EnabledTotp;