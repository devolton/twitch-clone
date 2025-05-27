'use client'
import {
    type FindSocialLinksQuery,
    useFindSocialLinksQuery, useRemoveSocialLinkMutation,
    useUpdateSocialLinkMutation
} from "@/graphql/generated/output";
import {type DraggableProvided} from "@hello-pangea/dnd";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {socialLinksSchema, type TypeSocialLinksSchema} from "@/schemas/user/social-links.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {GripVertical, Pencil, Trash2} from "lucide-react";
import {useState} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Separator} from "@/components/ui/common/seperator";
import {Button} from "@/components/ui/common/button";
import {toast} from "sonner";

interface Props {
    socialLink: FindSocialLinksQuery['findSocialLinks'][0],
    provided: DraggableProvided
}

const SocialLinkItem = ({socialLink, provided}: Props) => {
    const t = useTranslations('dashboard.settings.profile.socialLink.editForm');
    const [editingId, setEditingId] = useState<number | null>(null)
    const {refetch} = useFindSocialLinksQuery();
    const form = useForm<TypeSocialLinksSchema>({
        resolver: zodResolver(socialLinksSchema),
        values: {
            title: socialLink.title ?? '',
            url: socialLink.url ?? ''
        }
    });

    const {isValid, isDirty} = form.formState;

    function toggleEditing(id: number | null) {
        setEditingId(id)
    }

    const [update, {loading: isLoadingUpdate}] = useUpdateSocialLinkMutation({
        onCompleted() {
            toggleEditing(null);
            refetch();
            toast.success(t('successUpdateMessage'));
        },
        onError() {
            toast.error(t('errorUpdateMessage'));
        }
    })


    const [remove, {loading: isLoadingRemove}] = useRemoveSocialLinkMutation({
        onCompleted() {
            refetch();
            toast.success(t('successRemoveMessage'));
        },
        onError() {
            toast.error(t('errorRemoveMessage'));
        }
    })

    function onSubmit(data: TypeSocialLinksSchema) {
        update({variables: {id: socialLink.id, data: data}})
    }

    return (
        <div className={'mb-4 flex items-center gap-x-2 rounded-md border border-border bg-background text-sm'}
             ref={provided.innerRef}
             {...provided.draggableProps}>
            <div
                className={'rounded-l-md border-r border-r-border px-2 py-9 text-foreground transition'} {...provided.draggableProps}>
                <GripVertical className={'size-5'}/>
            </div>
            <div className={'space-y-1 px-2'}>
                {
                    editingId === socialLink.id ?
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}
                                  className={'flex gap-x-6'}>
                                <div className={'w-96 space-y-2'}>
                                    <FormField name={'title'}
                                               control={form.control}
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormControl>
                                                           <Input placeholder={'Youtube'}
                                                                  disabled={isLoadingUpdate || isLoadingRemove}
                                                                  className={'h-8'}
                                                                  {...field}/>
                                                       </FormControl>
                                                   </FormItem>)
                                               }
                                    />
                                    <FormField name={'url'}
                                               control={form.control}
                                               render={({field}) => (
                                                   <FormItem>
                                                       <FormControl>
                                                           <Input placeholder={'https://youtube.com'}
                                                                  disabled={isLoadingUpdate || isLoadingRemove}
                                                                  className={'h-8'}
                                                                  {...field}/>
                                                       </FormControl>
                                                   </FormItem>)
                                               }
                                    />
                                </div>
                                <div className={'flex items-center gap-x-4'}>
                                    <Button onClick={() => toggleEditing(null)}
                                            variant={'secondary'}>
                                        {t('cancelButton')}
                                    </Button>
                                    <Button disabled={isLoadingUpdate || !isDirty || !isValid || isLoadingRemove}>
                                        {t('submitButton')}
                                    </Button>


                                </div>


                            </form>

                        </Form>
                        :
                        <>
                            <h2 className={'font-semibold text-[17px] tracking-normal text-foreground'}>{socialLink.title}</h2>
                            <p className={'text-muted-foreground'}>{socialLink.url}</p>
                        </>
                }

            </div>
            <div className={'ml-auto flex items-center gap-x-2 pr-4'}>
                {editingId === socialLink.id &&
                    <Button onClick={() => toggleEditing(socialLink.id)}
                            variant={'ghost'}
                            size={'lgIcon'}>
                        <Pencil className={'size-4 text-muted-foreground'}/>
                    </Button>
                }
                <Button
                    onClick={() => remove({variables: {id: socialLink.id}})}
                    variant={'ghost'}
                    size={'lgIcon'}>
                    <Trash2 className={'size-4 text-muted-foreground'}/>
                </Button>
            </div>

        </div>
    );
};

export default SocialLinkItem;