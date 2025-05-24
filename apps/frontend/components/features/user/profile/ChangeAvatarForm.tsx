'use client'

import {useTranslations} from "next-intl";
import {useCurrent} from "@/hooks/useCurrent";
import {type ChangeEvent, useRef} from "react";
import {useForm} from "react-hook-form";
import {type TypeUploadFileSchema, uploadFileSchema} from "@/schemas/auth/upload-file";
import {zodResolver} from "@hookform/resolvers/zod";
import ChangeAvatarFormSkeleton from "@/components/ui/elements/skeletons/ChangeAvatarFormSkeleton";
import FormWrapper from "@/components/ui/elements/FormWrapper";
import {Form, FormField} from "@/components/ui/common/form";
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";
import {Button} from "@/components/ui/common/button";
import {useChangeProfileAvatarMutation, useRemoveProfileAvatarMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {Trash} from "lucide-react";
import ConfirmModal from "@/components/ui/elements/ConfirmModal";

const ChangeAvatarForm = () => {
    const t = useTranslations('dashboard.settings.profile.avatar');
    const {user, isLoadingProfile, refetch} = useCurrent();
    const inputRef = useRef<HTMLInputElement>(null);
    const form = useForm<TypeUploadFileSchema>({
        resolver: zodResolver(uploadFileSchema),
        values: {
            file: user?.avatar! //todo remove
        }
    });
    const [update, {loading: isLoadingUpdate}] = useChangeProfileAvatarMutation({
        onCompleted() {
            refetch();
            toast.success(t('successUpdateMessage'));
        },
        onError() {
            toast.error(t('errorUpdateMessage'));
        }
    })

    const [remove, {loading: isLoadingRemove}] = useRemoveProfileAvatarMutation({
        onCompleted() {
            refetch();
            toast.success(t('successRemoveMessage'));
        },
        onError() {
            toast.error(t('errorRemoveMessage'));
        }
    })

    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('file', file);
            update({
                variables: {
                    avatar: file
                }
            })
        }
    }


    return isLoadingProfile ?
        <ChangeAvatarFormSkeleton/>
        :
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <FormField control={form.control} name={'file'} render={({field}) => (
                    <div className={'px-5 pb-5'}>
                        <div className={'w-full items-center lg:flex space-x-6'}>
                            <ChannelAvatar size={'xl'} channel={{
                                username: user?.username ?? 'Channel',
                                avatar: field.value instanceof File ? URL.createObjectURL(field.value) : field.value
                            }}/>
                            <div className={'space-y-3'}>
                                <div className={'flex items-center gap-x-3'}>
                                    <input type={'file'} className={'hidden'} ref={inputRef}
                                           onChange={handleImageChange}/>
                                    <Button variant={'secondary'}
                                            disabled={isLoadingUpdate || isLoadingRemove}
                                            onClick={() => inputRef?.current?.click()}>
                                        {t('updateButton')}
                                    </Button>
                                    {user?.avatar &&
                                    <ConfirmModal heading={t('confirmModal.heading')}
                                                  message={t('confirmModal.message')}
                                                  onConfirm={()=>remove()}>
                                        <Button
                                            size={'lgIcon'}
                                            variant={'ghost'}
                                            disabled={isLoadingUpdate || isLoadingRemove}>
                                            <Trash className={'size-4'}/>
                                        </Button>
                                    </ConfirmModal>
                                    }


                                </div>
                                <p className={'text-muted-foreground text-sm'}>{t('info')}</p>
                            </div>
                        </div>
                    </div>
                )}/>

            </Form>
        </FormWrapper>
};

export default ChangeAvatarForm;

