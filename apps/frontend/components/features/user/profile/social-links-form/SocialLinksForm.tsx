'use client'
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    useChangeProfileInfoMutation,
    useCreateSocialLinkMutation,
    useFindSocialLinksQuery
} from "@/graphql/generated/output";
import {socialLinksSchema, TypeSocialLinksSchema} from "@/schemas/user/social-links.schema";
import {toast} from "sonner";
import SocialLinksFormSkeleton from "@/components/ui/elements/skeletons/SocialLinksFormSkeleton";
import FormWrapper from "@/components/ui/elements/FormWrapper";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Separator} from "@/components/ui/common/seperator";
import {Button} from "@/components/ui/common/button";
import SocialLinksList from "@/components/features/user/profile/social-links-form/SocialLinksList";

const SocialLinksForm = () => {
    const t = useTranslations('dashboard.settings.profile.socialLinks.createForm');
    const {refetch} = useFindSocialLinksQuery();
    const form = useForm<TypeSocialLinksSchema>({
        resolver: zodResolver(socialLinksSchema),
        values: {
            title: '',
            url: ''
        }
    });
    const [create, {loading: isLoadingCreate}] = useCreateSocialLinkMutation({
        onCompleted() {
            form.reset();
            refetch();
            toast.success(t('successMessage'));
        },
        onError() {
            toast.error(t('errorMessage'));
        }
    });

    const {isValid} = form.formState;

    function onSubmit(data: TypeSocialLinksSchema) {
        create({
            variables: {data}
        })
    }


    return isLoadingCreate ? <SocialLinksFormSkeleton/> :
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField name={'title'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem className={'px-5'}>
                                       <FormLabel>{t('titleLabel')}</FormLabel>
                                       <FormControl>
                                           <Input placeholder={'titlePlaceholder'}
                                                  disabled={isLoadingCreate} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('titleDescription')}
                                       </FormDescription>
                                   </FormItem>)
                               }
                    />
                    <Separator/>
                    <FormField name={'url'}
                               control={form.control}
                               render={({field}) => (
                                   <FormItem className={'px-5'}>
                                       <FormLabel>{t('urlLabel')}</FormLabel>
                                       <FormControl>
                                           <Input placeholder={'urlPlaceholder'}
                                                  disabled={isLoadingCreate} {...field}/>
                                       </FormControl>
                                       <FormDescription>
                                           {t('urlDescription')}
                                       </FormDescription>
                                   </FormItem>)
                               }
                    />
                    <Separator/>
                    <div className={'flex justify-end p-5 '}>
                        <Button disabled={isLoadingCreate || isValid}>
                            {t('submitButton')}
                        </Button>
                    </div>

                </form>

            </Form>
            <SocialLinksList/>

        </FormWrapper>
};

export default SocialLinksForm;