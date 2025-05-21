'use client'

import {FC, useState} from "react";
import AuthWrapper from "@/components/features/auth/AuthWrapper";
import {useForm} from "react-hook-form";
import {createAccountSchema, TypeCreateAccountSchema} from "@/schemas/auth/create-account.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/common/form";
import {Input} from "@/components/ui/common/input";
import {Button} from "@/components/ui/common/button";
import {useCreateUserMutation} from "@/graphql/generated/output";
import {toast} from "sonner";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/common/alert";
import {CircleCheck} from "lucide-react";
import {useTranslations} from "next-intl";

interface Props {
    className?: string;
}

const CreateAccountForm: FC<Props> = ({className}) => {
    const t = useTranslations('auth.register');;
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const form = useForm<TypeCreateAccountSchema>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });
    const [create, {loading: isLoadingCreate}] = useCreateUserMutation({ //first -method name, second - operation status props
        onCompleted() {
            setIsSuccess(true)
        },
        onError() {
            toast.error(t('errorMessage'));
        }
    });

    const {isValid} = form.formState;

    function onSubmit(data: TypeCreateAccountSchema) {
        create({variables: {data}})
    }

    return (
        <AuthWrapper
            className={className}
            heading={t('heading')}
            backButtonHref={'/account/login'}
            backButtonLabel={t('backButtonLabel')}>
            {
                isSuccess ?
                    <Alert>
                        <CircleCheck className={'size-4'}/>
                        <AlertTitle>{t('successAlertTitle')}</AlertTitle>
                        <AlertDescription>{t('successAlertDescription')}</AlertDescription>
                    </Alert>
                    :
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={'grid gap-y-3'}>
                            <FormField name={'username'}
                                       control={form.control}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel>{t('usernameLabel')}</FormLabel>
                                               <FormControl>
                                                   <Input placeholder={'johndoe'}
                                                          disabled={isLoadingCreate} {...field}/>
                                               </FormControl>
                                               <FormDescription>
                                                   {t('usernameDescription')}
                                               </FormDescription>
                                           </FormItem>)
                                       }
                            />

                            <FormField name={'email'}
                                       control={form.control}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel>{t('emailLabel')}</FormLabel>
                                               <FormControl>
                                                   <Input placeholder={'johndoe@gmail.com'}
                                                          disabled={isLoadingCreate} {...field}/>
                                               </FormControl>
                                               <FormDescription>
                                                   {t('emailDescription')}
                                               </FormDescription>
                                           </FormItem>)
                                       }
                            />
                            <FormField name={'password'}
                                       control={form.control}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel>{t('passwordLabel')}</FormLabel>
                                               <FormControl>
                                                   <Input type={'password'} placeholder={'*******'}
                                                          disabled={isLoadingCreate} {...field}/>
                                               </FormControl>
                                               <FormDescription>
                                                   {t('passwordDescription')}
                                               </FormDescription>
                                           </FormItem>)
                                       }
                            />
                            <Button className={'w-full mt-2'} disabled={!isValid || isLoadingCreate}>{t('submitButton')}</Button>
                        </form>
                    </Form>
            }
        </AuthWrapper>
    );
};

export default CreateAccountForm;
