'use client'

import {useTranslations} from "next-intl";
import {useTheme} from "next-themes";
import {useForm} from "react-hook-form";
import {changeThemeSchema, TypeChangeThemeSchema} from "@/schemas/user/change-theme.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Form, FormField} from "@/components/ui/common/form";
import ToggleCard from "@/components/ui/elements/ToggleCard";

const ChangeThemeForm = () => {
    const t = useTranslations('dashboard.settings.appearance.theme');
    const {theme, setTheme} = useTheme();

    const form = useForm<TypeChangeThemeSchema>({
        resolver: zodResolver(changeThemeSchema),
        defaultValues: {
            theme: theme === 'dark' ? 'dark' : 'light'
        }
    })

    function onChange(value: boolean) {
        const newValue = value ? 'dark' : 'light';
        setTheme(newValue);
        form.setValue('theme', newValue);
        toast.success('successMessage')
    }

    return <Form  {...form}>
        <FormField name={'theme'}
                   control={form.control}
                   render={({field}) => (
                       <ToggleCard heading={t('heading')}
                                   description={t('description')}
                                   value={field.value ==='dark'}
                                   onChange={onChange}/>
                   )}/>
    </Form>
};

export default ChangeThemeForm;