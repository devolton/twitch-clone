import {type FC, type PropsWithChildren} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/common/tooltip";

interface Props {
    label: string;
    asChild?: boolean;
    side?: 'top' | 'bottom' | 'left' | 'right',
    align?: 'start' | 'end' | 'center'
}

const Hint: FC<PropsWithChildren<Props>> = ({label, asChild, side, align, children}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
                <TooltipContent className={'bg-[#1f2128]  text-white dark:bg-white dark:text-[#1f2128] '}
                                side={side}
                                align={align}
                >
                    <p className={'font-semibold'}>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Hint;
