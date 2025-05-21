import {FC} from "react";
import {redirect} from "next/navigation";
import VerifyAccountForm from "@/components/features/auth/forms/VerifyAccountForm";


const VerifyAccountPage = async (props: {
    searchParams: Promise<{ token: string }>
}) => {
    const searchParams = await props.searchParams;
    if (!searchParams.token)
        return redirect('/account/create');
    return (
        <VerifyAccountForm/>
    );
};

export default VerifyAccountPage;
