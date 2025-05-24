'use client'


import {useTranslations} from "next-intl";
import {useFindRecommendedChannelsQuery} from "@/graphql/generated/output";
import {useSidebar} from "@/hooks/useSidebar";
import {Separator} from "@/components/ui/common/seperator";
import ChannelItem from "@/components/layouts/header/sidebar/ChannelItem";
import {ChannelItemSkeleton} from "@/components/ui/elements/skeletons/ChannelItemSkeleton";

export function RecommendedChannels() {
    const t = useTranslations('layout.sidebar.recommended');
    const {isCollapsed} = useSidebar();
    const {data, loading: isLoadingRecommended} = useFindRecommendedChannelsQuery();
    const channels = data?.findRecommendedChannels ?? [];
    return <div>
        <Separator className={'mb-3'}/>
        {!isCollapsed && <h2 className={'text-lg mb-2 font-semibold text-foreground px-2'}>{t('heading')}</h2>}
        {isLoadingRecommended ?
            Array.from([{length: 7}]).map((_, index) =>
                <ChannelItemSkeleton key={'recommended-skeleton-' + index}/>
            )
            :
            channels.map((channel, index) =>
                <ChannelItem key={index} channel={channel}/>
            )}
    </div>
}