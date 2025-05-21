import {type FC} from "react";
import {useFindUnreadNotificationsCountQuery} from "@/graphql/generated/output";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/common/popover";
import {Bell} from "lucide-react";
import NotificationsList from "@/components/layouts/header/notifications/NotificationsList";

interface Props {
    className?: string;
}

const Notifications: FC<Props> = ({className}) => {
    const {data, loading: isLoadingCount} = useFindUnreadNotificationsCountQuery();
    const count = data?.findNotificationsUnreadCount ?? 0;
    const displayCount = count > 10 ? '+9' : count;

    if (isLoadingCount)
        return null;


    return (
        <Popover>
            <PopoverTrigger>
                {count !== 0
                    &&
                    <div
                        className={'absolute right-[72px] top-5 rounded-full bg-primary px-[5px] text-sm font-semibold text-white'}>
                        {displayCount}
                    </div>}
                <Bell className={'size-5 text-foreground'}/>
            </PopoverTrigger>
            <PopoverContent align={'end'} className={'max-h-[500px] w-[320px] overflow-y-auto'}>
                <NotificationsList/>
            </PopoverContent>

        </Popover>
    );
};

export default Notifications;
