import {useTranslations} from "next-intl";
import {useFindSocialLinksQuery, useReorderSocialLinksMutation} from "@/graphql/generated/output";
import {useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable, type DropResult} from "@hello-pangea/dnd";
import {Separator} from "@/components/ui/common/seperator";
import SocialLinkItem from "@/components/features/user/profile/social-links-form/SocialLinkItem";
import {toast} from "sonner";


const SocialLinksList = () => {
    const t = useTranslations('dashboard.settings.profile.socialLinks');
    const {data, refetch} = useFindSocialLinksQuery();
    const items = data?.findSocialLinks ?? [];
    const [socialLinks, setSocialLinks] = useState(items);

    useEffect(() => {
        setSocialLinks(items);
    }, [items]);

    const [reorder, {loading: isReorderLoading}] = useReorderSocialLinksMutation({
        onCompleted() {
            refetch();
            toast.success(t('successReorderMessage'));
        },
        onError() {
            toast.error(t('errorReorderMessage'));
        }
    })

    function onDrugEnd(result: DropResult) {
        if (!result.destination) return;
        const items = Array.from(socialLinks);
        const [reorderItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderItem);
        const bulkUpdateData = items.map((socialLink, index) => ({
            id: socialLink.id,
            position: index

        }));
        setSocialLinks(items);
        reorder({variables: {list: bulkUpdateData}})

    }


    return socialLinks.length > 0 &&
        <>
            <Separator/>
            <div className={'px-5 mt-5'}>
                <DragDropContext onDragEnd={onDrugEnd}>
                    <Droppable droppableId={'social-links'}>
                        {provided => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {socialLinks.map((socialLink, index) => (
                                    <Draggable key={index}
                                               draggableId={String(socialLink.id)}
                                               index={index}
                                               isDragDisabled={isReorderLoading}>
                                        {
                                            provided => (
                                                <SocialLinkItem key={index}
                                                                socialLink={socialLink}
                                                                provided={provided}/>
                                            )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>

                </DragDropContext>

            </div>
        </>
};

export default SocialLinksList;