import {getRequestConfig} from 'next-intl/server'
import {getCurrentLanguage} from "@/lib/i18n/language";

export default getRequestConfig(async () => {
    const language = await getCurrentLanguage();
    return {
        locale: language,
        messages:(await import(`../../public/lang/${language}.json`)).default,
    };
})