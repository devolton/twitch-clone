import {type PropsWithChildren} from 'react';
import CardContainer from "@/components/ui/elements/CardContainer";
import {Switch} from "@/components/ui/common/Switch";

interface Props {
    heading: string;
    description: string;
    isDisabled?: boolean;
    value: boolean;
    onChange: (value: boolean) => void;
}

const ToggleCard = ({
                        heading,
                        description,
                        isDisabled,
                        value,
                        onChange,
                        children
                    }: PropsWithChildren<Props>) => {
    return (
        <CardContainer heading={heading} description={description} rightContent={
            <Switch checked={value}
                    onCheckedChange={onChange}
                    disabled={isDisabled}/>
        }>
            {children}
        </CardContainer>
    );
};

export default ToggleCard;
