import {FC} from "react";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import LoginAccountForm from "@/components/features/auth/forms/LoginAccountForm";

interface Props {
    className?: string;
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.login');

    return {
        title: t('heading'),
    }
}

const LoginPage: FC<Props> = ({className}) => {
    return (
        <LoginAccountForm/>
    );
};

export default LoginPage;
