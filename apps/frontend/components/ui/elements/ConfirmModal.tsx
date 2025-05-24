'use client'


import {useTranslations} from "next-intl";
import {PropsWithChildren} from "react";
import {
    AlertDialogAction,
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogFooter
} from "@/components/ui/common/AlertDialog";


interface Props {
    heading: string,
    message: string,
    onConfirm: () => void,
}


const ConfirmModal = ({heading, message, onConfirm, children}: PropsWithChildren<Props>) => {
    const t = useTranslations('components.confirmModal');
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{heading}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{t('continue')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    );
};

export default ConfirmModal;