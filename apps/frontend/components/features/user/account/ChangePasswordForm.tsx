import {useTranslations} from "next-intl";
import {useCurrent} from "@/hooks/useCurrent";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useChangePasswordMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {changePasswordSchema, type TypeChangePasswordSchema} from "@/schemas/user/change-password.schema";
import FormWrapper from "@/components/ui/elements/FormWrapper";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Separator} from "@/components/ui/common/seperator";
import {Button} from "@/components/ui/common/button";
import ChangePasswordFormSkeleton from "@/components/ui/elements/skeletons/ChangePasswordFormSkeleton";


const ChangePasswordForm = () => {
    const t = useTranslations('dashboard.settings.account.password');
    const {isLoadingProfile, refetch} = useCurrent();
    const form = useForm<TypeChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
        values: {
            oldPassword: '',
            newPassword: ''
        }
    });
    const onSubmit = (data: TypeChangePasswordSchema) => {
        update({
            variables: {
                data
            }
        })

    }
    const [update, {loading: isLoadingUpdate}] = useChangePasswordMutation({
        onCompleted() {
            refetch();
            form.reset();
            toast.success(t('successMessage'));
        },
        onError() {
            toast.error(t('errorMessage'));
        }
    })

    const {isValid} = form.formState;
    return isLoadingProfile ? <ChangePasswordFormSkeleton/> :
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={'grid gap-y-3'}>
                    <FormField name={'oldPassword'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem className={'px-5'}>
                                       <FormLabel>{t('oldPasswordLabel')}</FormLabel>
                                       <FormControl>
                                           <Input placeholder={'*******'}
                                                  type={'password'}
                                                  disabled={isLoadingProfile || isLoadingUpdate} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('oldPasswordDescription')}
                                       </FormDescription>
                                   </FormItem>)
                               }
                    />
                    <Separator/>
                    <FormField name={'newPassword'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem className={'px-5'}>
                                       <FormLabel>{t('newPasswordLabel')}</FormLabel>
                                       <FormControl>
                                           <Input placeholder={'*******'}
                                                  type={'password'}
                                                  disabled={isLoadingProfile || isLoadingUpdate} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('newPasswordDescription')}
                                       </FormDescription>
                                   </FormItem>)
                               }
                    />
                    <div className={'flex justify-end p-5 '}>
                        <Button disabled={isValid || isLoadingUpdate}>
                            {t('submitButton')}
                        </Button>
                    </div>

                </form>
            </Form>
        </FormWrapper>
};

export default ChangePasswordForm;