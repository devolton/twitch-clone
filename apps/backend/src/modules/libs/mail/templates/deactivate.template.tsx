import * as React from 'react'
import {Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text} from "@react-email/components";
import type {SessionMetadata} from "../../../../shared/types/session-metadata.types";

type DeactivateTemplateProps = {
    token:string,
    metadata:SessionMetadata,
}

export function DeactivateTemplate({token,metadata}:DeactivateTemplateProps) {

    const deactivateLink = `${token}/${metadata}`

    return (
        <Html>
            <Head/>
            <Preview>Account deactivation</Preview>
            <Tailwind>
                <Body className={'max-w-2xl mx-auto p-6 bg-slate-50'}>
                    <Section className="text-center mb-8">
                        <h1 className={'text-3xl text-black font-bold'}>
                                Request for account deactivation
                        </h1>
                        <Text className={'text-black text-base mt-2'}>
                            You have initiated the process of deactivating your account on the platform <b>DevoltonStream</b>
                        </Text>
                    </Section>
                    <Section className="bg-gray-100 p-6 rounded-lg text-center">
                        <Heading className={'text-black text-2xl font-semibold'}>Confirmation code:</Heading>
                        <Heading className={'text-3xl text-black font-semibold'}>${token}</Heading>
                        <Text className={'text-black'}>
                           This code is valid for 5 minutes
                        </Text>

                    </Section>
                    <Section className="bg-gray-100 rounded-lg mb-6 p-6">
                        <Heading className={`text-xl font-semibold text-[#18b9ae]}`}>
                            Information about request:
                        </Heading>
                        <ul className={'list-disc list-inside text-black'}>
                            <li>🌎 Location: ${metadata.location.country},${metadata.location.city} </li>
                            <li>🛠️ Operation system: ${metadata.device.os}</li>
                            <li>🌐 Browser: ${metadata.device.browser}</li>
                            <li>⛓️ IP address: ${metadata.ip}</li>
                        </ul>
                        <Text className={'font-gray-600 mt-2'}>
                            ❗❗❗ If you did not initiate this request, please ignore this message❗❗❗
                        </Text>


                    </Section>
                    <Section className="text-center mt-8">
                        <Text className={'text-gray-600'}>
                            If you have questions or encounter difficulties, you can contact our support team at{' '}
                            <Link href={'mailto:onboarding@resend.dev'}
                                  className={'underline text-[#18b9ae]'}>
                                onboarding@resend.dev
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}