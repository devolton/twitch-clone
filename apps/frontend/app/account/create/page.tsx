import {FC} from "react";
import {Metadata} from "next";
import CreateAccountForm from "@/components/features/auth/forms/CreateAccountForm";
import {getTranslations} from "next-intl/server";

interface Props {
    className?: string;
}


export async function generateMetadata():Promise<Metadata>{
    const t = await getTranslations('auth.register');

    return {
        title: t('heading'),
    }
}

const CreateAccountPage: FC<Props> = ({className}) => {
    return (
        <div className={className}>
            <CreateAccountForm/>

        </div>
    );
};

export default CreateAccountPage;
