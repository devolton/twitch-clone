'use client'
import {FindRecommendedChannelsQuery} from "@/graphql/generated/output";
import {usePathname} from "next/navigation";
import {useSidebar} from "@/hooks/useSidebar";
import Hint from "@/components/ui/elements/Hint";
import {Button} from "@/components/ui/common/button";
import {cn} from "@/lib/utils";
import Link from "next/link";
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";
import ChannelVerified from "@/components/ui/elements/ChannelVerified";
import LiveBadge from "@/components/ui/elements/LiveBadge";
import {Skeleton} from "@/components/ui/common/Skeleton";

interface Props {
    channel: FindRecommendedChannelsQuery['findRecommendedChannels'][0];
}

const ChannelItem = ({channel}: Props) => {
    const pathname = usePathname();
    const {isCollapsed} = useSidebar();

    const isActive = pathname === `/${channel.username}`;
    return isCollapsed ?
        <Hint side={'right'} label={channel.username} asChild>
            <Link href={`/${channel.username}`} className={'flex items-center justify-center w-full mt-3'}>
                <ChannelAvatar channel={channel} isLive={channel.stream.isLive}/>
            </Link>
        </Hint>
        :
        <Button className={cn('h-11 mt-2 w-full justify-start', isActive && 'bg-accent')}
                variant={'ghost'}>
            <Link href={'/' + channel.username} className={'flex w-full -mr-5 items-center'}>
                <ChannelAvatar channel={channel} isLive={channel.stream.isLive} size={'sm'}/>
            </Link>
            <h2 className={'truncate pl-3 pr-2'}>{channel.username}</h2>
            {channel.isVerified && <ChannelVerified size={'sm'}/>}
            {channel.stream.isLive && <div className={'absolute right-5'}>
                <LiveBadge/>
            </div>}
        </Button>
};

export default ChannelItem;
