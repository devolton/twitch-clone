import {type FC, type PropsWithChildren} from "react";
import {cn} from "@/lib/utils";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/common/card";
import Image from "next/image";
import {Button} from "@/components/ui/common/button";
import Link from "next/link";

interface Props {
    heading: string,
    backButtonLabel?: string,
    backButtonHref?: string,
    className?: string;
}

const AuthWrapper: FC<PropsWithChildren<Props>> = ({children, heading, backButtonHref, backButtonLabel, className}) => {
    return (
        <div className={cn('flex h-full min-h-screen items-center justify-center', className)}>
            <Card className={'w-[450px]'}>
                <CardHeader className={'flex-row items-center justify-center gap-x-4'}>
                    <Image src={'/images/logo.svg'}
                           alt={'devolton-stream'}
                           width={40}
                           height={40}/>
                    <CardTitle>
                        {heading}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
                <CardFooter className={'-mt-2'}>
                    {
                        backButtonLabel && backButtonHref &&
                        <Button variant={'ghost'} className={'w-full'}>
                            <Link href={backButtonHref}>{backButtonLabel}</Link>
                        </Button>
                    }
                </CardFooter>
            </Card>
        </div>
    );
};

export default AuthWrapper;
