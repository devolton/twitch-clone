'use client'

import {useTranslations} from "next-intl";
import {useCurrent} from "@/hooks/useCurrent";
import {useForm} from "react-hook-form";
import {
    changeNotificationSettingsSchema,
    type TypeChangeNotificationSettingsSchema
} from "@/schemas/user/change-notification-settings.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import ToggleCardSkeleton from "@/components/ui/elements/skeletons/ToggleCardSkeleton";
import {Form, FormField} from "@/components/ui/common/form";
import ToggleCard from "@/components/ui/elements/ToggleCard";
import {useChangeNotificationSettingsMutation} from "@/graphql/generated/output";
import {toast} from "sonner";


const ChangeNotificationsSettingsForm = () => {
    const t = useTranslations('dashboard.settings.notifications');

    const {user, isLoadingProfile,refetch} = useCurrent();

    const [update, {loading: isLoadingUpdate}] = useChangeNotificationSettingsMutation({
        onCompleted(data) {
            refetch();
            toast.success('successMessage');
            if (data.changeNotificationSettings.telegramAuthToken) {
                window.open(`http://t.me/devoltonStreamBot?start=${data.changeNotificationSettings.telegramAuthToken}`, '_blank')//todo add full url
            }
        },
        onError() {
            toast.error('errorMessage');
        }
    })

    const form = useForm<TypeChangeNotificationSettingsSchema>({
        resolver: zodResolver(changeNotificationSettingsSchema),
        values: {
            siteNotifications: user?.notificationSettings.siteNotifications ?? false,
            telegramNotifications: user?.notificationSettings.telegramNotifications ?? false
        }
    });

    function onChange(field: keyof TypeChangeNotificationSettingsSchema, value: boolean) {
        form.setValue(field, value)
        update({
            variables: {
                data: {
                    ...form.getValues(),
                    [field]: value
                }

            }
        });

    }

    return isLoadingProfile
        ?
        Array.from({length: 2}).map((_, index) =>
            <ToggleCardSkeleton key={index}/>)
        :
        <Form{...form}>
            <form className={'mt-3'}>
                <FormField name={'siteNotifications'}
                           control={form.control}
                           render={({field}) => (
                               <ToggleCard heading={t('siteNotifications.heading')}
                                           description={'siteNotifications.description'}
                                           value={field.value}
                                           isDisabled={isLoadingUpdate}
                                           onChange={(value) => onChange('siteNotifications', value)}/>
                           )}/>
                <FormField name={'telegramNotifications'}
                           control={form.control}
                           render={({field}) => (
                               <ToggleCard heading={t('telegramNotifications.heading')}
                                           description={'telegramNotifications.description'}
                                           value={field.value}
                                           isDisabled={isLoadingUpdate}
                                           onChange={(value) => onChange('telegramNotifications', value)}/>
                           )}/>
            </form>

        </Form>
};

export default ChangeNotificationsSettingsForm;