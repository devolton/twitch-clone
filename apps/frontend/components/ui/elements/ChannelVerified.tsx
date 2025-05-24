import {type FC} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {FindProfileQuery} from "@/graphql/generated/output";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/common/avatar";
import {getMediaSource} from "@/lib/get-media-source";
import {Check} from "lucide-react";

const channelVerifiedSizes = cva('', {
    variants: {
        size: {
            sm: 'size-3',
            default: 'size-4'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})


interface Props extends VariantProps<typeof channelVerifiedSizes> {}

const ChannelVerified = ({size}:Props) => {
    return (
        <span className={cn('flex items-center justify-center bg-primary p-0.5',channelVerifiedSizes({size}))}>
            <Check className={cn('stroke-1 text-white',size=='sm' ? 'size-2' : 'size-[11px]')}/>
        </span>
    );
};

export default ChannelVerified;
