import DeactivateForm from "@/components/features/auth/forms/DeactivateForm";
import {getTranslations} from "next-intl/server";

export const generateMetadata = async () => {
    const t = await getTranslations('auth.deactivate');
    return {
        title: t('heading'),
    }
}


const DeactivatePage = () => {
    return (
        <DeactivateForm/>
    );
};

export default DeactivatePage;
