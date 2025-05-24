'use client'

import {useTranslations} from "next-intl";
import {useCurrent} from "@/hooks/useCurrent";
import {useForm} from "react-hook-form";
import {changeInfoSchema, type TypeChangeInfoSchema} from "@/schemas/user/change-info.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import ChangeInfoFormSkeleton from "@/components/ui/elements/skeletons/ChangeInfoFormSkeleton";
import FormWrapper from "@/components/ui/elements/FormWrapper";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Separator} from "@/components/ui/common/seperator";
import {Textarea} from "@/components/ui/common/TextArea";
import {Button} from "@/components/ui/common/button";
import {useChangeProfileInfoMutation} from "@/graphql/generated/output";
import {toast} from "sonner";

const ChangeInfoForm = () => {
    const t = useTranslations('dashboard.settings.profile.info');
    const {user, isLoadingProfile, refetch} = useCurrent();
    const form = useForm<TypeChangeInfoSchema>({
        resolver: zodResolver(changeInfoSchema),
        values: {
            bio: user?.bio ?? '',
            username: user?.username ?? '',
            displayName: user?.displayName ?? ''
        }
    });
    const onSubmit = (data: TypeChangeInfoSchema) => {
        update({
            variables: {
                data
            }
        })

    }
    const [update, {loading: isLoadingUpdate}] = useChangeProfileInfoMutation({
        onCompleted() {
            refetch();
            toast.success(t('successMessage'));
        },
        onError() {
            toast.error(t('errorMessage'));
        }
    })

    const {isValid, isDirty} = form.formState;
    return isLoadingProfile ? <ChangeInfoFormSkeleton/> :
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className={'grid gap-y-3'}>
                    <FormField name={'username'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem className={'px-5'}>
                                       <FormLabel>{t('usernameLabel')}</FormLabel>
                                       <FormControl>
                                           <Input placeholder={'usernamePlaceholder'}
                                                  disabled={isLoadingProfile || isLoadingUpdate} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('usernameDescription')}
                                       </FormDescription>
                                   </FormItem>)
                               }
                    />
                    <Separator/>
                    <FormField name={'displayName'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem className={'px-5'}>
                                       <FormLabel>{t('displayNameLabel')}</FormLabel>
                                       <FormControl>
                                           <Input placeholder={'displayNamePlaceholder'}
                                                  disabled={isLoadingProfile || isLoadingUpdate} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('displayNameDescription')}
                                       </FormDescription>
                                   </FormItem>)
                               }
                    />
                    <Separator/>
                    <FormField name={'bio'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem className={'px-5'}>
                                       <FormLabel>{t('bioLabel')}</FormLabel>
                                       <FormControl>
                                           <Textarea placeholder={'bioPlaceholder'}
                                                     disabled={isLoadingProfile || isLoadingUpdate} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('bioDescription')}
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

export default ChangeInfoForm;


