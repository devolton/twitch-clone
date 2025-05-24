import {type FC} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {FindProfileQuery} from "@/graphql/generated/output";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/common/avatar";
import {getMediaSource} from "@/lib/get-media-source";

const avatarSizes = cva('', {
    variants: {
        size: {
            sm: 'size-7',
            default: 'size-9',
            lg: 'size-14',
            xl: 'size-43'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})


interface Props extends VariantProps<typeof avatarSizes> {
    channel?: Pick<FindProfileQuery['findProfile'], 'username' | 'avatar'>,
    isLive?: boolean
    className?: string;
}

const ChannelAvatar: FC<Props> = ({size, channel, isLive, className}) => {
    return (
        <div className={'relative'}>
            <Avatar className={cn(avatarSizes({size}), isLive && 'ring-2 ring-rose-500', className)}>
                <AvatarImage src={getMediaSource(channel?.avatar!)} className={'object-cover'}/> //todo remove !
                <AvatarFallback className={cn(size === 'xl' && 'text-4xl')}>
                    {channel?.username?.[0].toString().toLowerCase()}
                </AvatarFallback>
            </Avatar>

        </div>
    );
};

export default ChannelAvatar;
