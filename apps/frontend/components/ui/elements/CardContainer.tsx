import {type PropsWithChildren, type ReactNode} from 'react';
import {Card} from "@/components/ui/common/card";

interface Props {
    heading: string;
    description: string;
    rightContent?: ReactNode;
}

const CardContainer = ({heading, description, rightContent, children}: PropsWithChildren<Props>) => {
    return (
        <Card className={'p-4'}>
            <div className={'flex justify-between items-center'}>
                <div className={'space-y-1'}>
                    <h2 className={'font-semibold tracking-wide'}>{heading}</h2>
                    <p className={'max-w-4xl text-sm text-muted-foreground'}>{description}</p>

                </div>
                {
                    rightContent && <div>
                        {rightContent}
                    </div>
                }
            </div>
            {children && <div className={'mt-4'}>
                {children}
            </div>}
        </Card>
    );
};

export default CardContainer;