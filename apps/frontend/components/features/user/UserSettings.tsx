'use client'
import React from 'react';
import {useTranslations} from "next-intl";
import Heading from "@/components/ui/elements/Heading";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/common/Tabs";
import ChangeAvatarForm from "@/components/features/user/profile/ChangeAvatarForm";

const UserSettings = () => {
    const t = useTranslations('dashboard.settings');


    return (
        <div className={'lg:px-10'}>
            <Heading title={t('header.heading')}
                     description={t('header.description')}
                     size={'lg'}/>
            <Tabs defaultValue="profile" className="w-full mt-3">
                <TabsList className="grid max-w-2xl grid-cols-5">
                    <TabsTrigger value="profile">{t('header.profile')}</TabsTrigger>
                    <TabsTrigger value="account">{t('header.account')}</TabsTrigger>
                    <TabsTrigger value="appearance">{t('header.appearance')}</TabsTrigger>
                    <TabsTrigger value="notifications">{t('header.notifications')}</TabsTrigger>
                    <TabsTrigger value="sessions">{t('header.sessions')}</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <div className={'mt-5 space-y-6'}>
                        <Heading title={t('profile.header.heading')}
                                 description={t('profile.header.description')}/>
                        <ChangeAvatarForm/>

                    </div>
                </TabsContent>
                <TabsContent value="account">Account</TabsContent>
                <TabsContent value="appearance">Appearance</TabsContent>
                <TabsContent value="notifications">Notifications</TabsContent>
                <TabsContent value="sessions">Sessions</TabsContent>
            </Tabs>
        </div>
    );
};

export default UserSettings;