import {Metadata} from "next";
import {getTranslations} from "next-intl/server";

export async function generateMetadata():Promise<Metadata> {
    const t = await getTranslations('dashboard.settings.header');
    return {
        title:t('heading'),
        description:t('description'),
        robots:{
            index:false,
            follow:false,
        }
    }
}


const SettingsPage = () => {
    return (
        <div>
            Dashboard Settings SettingsPage
        </div>
    );
};

export default SettingsPage;