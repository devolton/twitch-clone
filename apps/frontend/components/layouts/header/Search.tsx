'use client'
import {type FC, type FormEvent, useState} from "react";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/common/input";
import {Button} from "@/components/ui/common/button";
import {SearchIcon} from "lucide-react";

interface Props {
    className?: string;
}

const Search: FC<Props> = ({className}) => {
    const t = useTranslations('layout.header.search');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter();

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/streams?searchTerm=${searchTerm}`)
        } else {
            router.push('/streams');
        }
    }

    return (
        <div className={cn('ml-auto hidden lg:block', className)}>
            <form className={'relative flex items-center'} onSubmit={onSubmit}>
                <Input type={'text'}
                       placeholder={t('placeholder')}
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className={'w-full rounded-full pl-4 pr-10 lg:w-[400px]'}/>
                <Button className={'absolute h-9 right-0.5'}
                        type={'submit'}>
                    <SearchIcon className={'absolute size-[18px]'}/>
                </Button>
            </form>
        </div>
    );
};

export default Search;
