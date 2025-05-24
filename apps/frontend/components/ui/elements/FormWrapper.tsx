import {type FC, type PropsWithChildren} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/common/card";

interface Props {
    heading:string,
}

const FormWrapper: FC<PropsWithChildren<Props>> = ({heading,children }) => {
    return (
        <Card>
            <CardHeader className={'p-4'}>
                <CardTitle className={'text-lg'}>{heading}</CardTitle>
            </CardHeader>
            <CardContent className={'p-0'}>
                {children}
            </CardContent>
        </Card>
    );
};

export default FormWrapper;
