'use client'

import {useTranslations} from "next-intl";
import {useCurrent} from "@/hooks/useCurrent";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useChangeEmailMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {changeEmailSchema, type TypeChangeEmailSchema} from "@/schemas/user/change-email.schema";
import ChangeEmailFormSkeleton from "@/components/ui/elements/skeletons/ChangeEmailFormSkeleton";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Separator} from "@/components/ui/common/seperator";
import {Button} from "@/components/ui/common/button";
import FormWrapper from "@/components/ui/elements/FormWrapper";


const ChangeEmailForm = () => {

    const t = useTranslations('dashboard.settings.account.email');
    const {user, isLoadingProfile, refetch} = useCurrent();
    const form = useForm<TypeChangeEmailSchema>({
        resolver: zodResolver(changeEmailSchema),
        values: {
            email:user?.email ?? ''
        }
    });
    const onSubmit = (data: TypeChangeEmailSchema) => {
        update({
            variables: {
                data
            }
        })

    }
    const [update, {loading: isLoadingUpdate}] = useChangeEmailMutation({
        onCompleted() {
            refetch();
            toast.success(t('successMessage'));
        },
        onError() {
            toast.error(t('errorMessage'));
        }
    })

    const {isValid, isDirty} = form.formState;
    return isLoadingProfile ? <ChangeEmailFormSkeleton/> :
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={'grid gap-y-3'}>
                    <FormField name={'email'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem className={'px-5'}>
                                       <FormLabel>{t('emailLabel')}</FormLabel>
                                       <FormControl>
                                           <Input placeholder={'johndoe@gmail.com'}
                                                  disabled={isLoadingProfile || isLoadingUpdate} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('emailDescription')}
                                       </FormDescription>
                                   </FormItem>)
                               }
                    />
                    <Separator/>
                    <div className={'flex justify-end p-5 '}>
                        <Button disabled={isDirty || isValid || isLoadingUpdate}>
                            {t('submitButton')}
                        </Button>
                    </div>

                </form>
            </Form>
        </FormWrapper>
};

export default ChangeEmailForm;