import * as React from 'react'
import {SessionMetadata} from "../../../../shared/types/session-metadata.types";
import {Body, Head, Html, Link, Preview, Section, Tailwind, Text, Heading} from "@react-email/components";

type PasswordRecoveryTemplateProps = {
    domain:string,
    token:string,
    metadata:SessionMetadata

}

export function PasswordRecoveryTemplate({domain,token,metadata}:PasswordRecoveryTemplateProps) {
    const resetLink = `${domain}/account/recovery/${token}`
    return (
        <Html>
            <Head/>
            <Preview>Reset password</Preview>
            <Tailwind>
                <Body className={'max-w-2xl mx-auto p-6 bg-slate-50'}>
                    <Section className="text-center mb-8">
                        <h1 className={'text-3xl text-black font-bold'}>

                        </h1>
                       <Text className={'text-black text-base mt-2'}>
                           You have requested a password reset for your account.
                       </Text>
                        <Text className={'text-black text-base mt-2'}>
                            To create a new password click on the link below
                        </Text>
                        <Link href={resetLink}
                              className={'inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18b9ae] px-5 py-2'}>
                            Reset password
                        </Link>
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