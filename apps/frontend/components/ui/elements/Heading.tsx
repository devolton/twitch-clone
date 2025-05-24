import {type FC} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

const headingSize = cva('', {
    variants: {
        size: {
            sm: 'text-lg',
            default: 'text-2xl',
            lg: 'text-4xl',
            xl: 'text-5xl'
        }
    },
    defaultVariants: {
        size: 'default'
    }
})


interface Props extends VariantProps<typeof headingSize> {
    title: string,
    description?: string,
    className?: string;
}

const Heading: FC<Props> = ({size, title, description, className}) => {
    return (
        <div className={'space-y-2'}>
            <h1 className={cn('font-semibold text-foreground', headingSize({size}))}>
                {title}
            </h1>
            {description && <p className={'text-muted-foreground'}>{description}</p>}
        </div>
    );
};

export default Heading;
