'use client'

import {useFindNotificationsByUserQuery, useFindUnreadNotificationsCountQuery} from "@/graphql/generated/output";
import {useTranslations} from "next-intl";
import {Separator} from "@/components/ui/common/seperator";
import {Loader2} from "lucide-react";
import {getNotificationIcon} from "@/lib/get-notification-icon";
import {Fragment} from "react";
import parse from "html-react-parser";


const NotificationsList = () => {
    const t = useTranslations('layout.header.headerMenu.notifications')
    const {refetch} = useFindUnreadNotificationsCountQuery();
    const {data, loading: isLoadingNotifications} = useFindNotificationsByUserQuery({
        onCompleted() {
            refetch();
        }
    });
    const notifications = data?.findNotificationsByUser ?? [];


    return (
        <div>
            <h2 className={'text-center text-lg font-medium'}>{t('heading')}</h2>
            <Separator className={'my-3'}/>
            {isLoadingNotifications ?
                <div className={'flex justify-center items-center gap-x-2 text-sm text-foreground'}>
                    <Loader2 className={'size-5 animate-spin'}/>
                    {t('loading')}
                </div>
                : notifications.length ?
                    (
                        notifications.map((notification, index) =>
                            {
                                const Icon = getNotificationIcon(notification.type);


                                return <Fragment key={index}>
                                    <div className={'flex items-center gap-x-3 text-sm'}>
                                        <div className={'rounded-full bg-foreground p-2'}>
                                            <Icon className={'size-6 text-secondary'}/>
                                        </div>
                                        <div>
                                            {parse(notification.message)}
                                        </div>
                                    </div>
                                    {index<notifications.length-1 && <Separator className={'my-3'}/>}
                                </Fragment>
                            }
                        )
                    )
                    :
                    (<div className={'text-center text-muted-foreground'}>
                        {t('empty')}
                    </div>)
            }

        </div>
    );
};

export default NotificationsList;
