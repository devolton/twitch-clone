import {forwardRef, type ComponentProps} from "react";

import {cn} from "@/lib/utils"

const Textarea = forwardRef<
    HTMLTextAreaElement,
    ComponentProps<"textarea">
>(({className, ...props}, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] max-h-[80px] w-full text-sm rounded-md border border-border bg-input px-3 py-2  shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"

export {Textarea}
