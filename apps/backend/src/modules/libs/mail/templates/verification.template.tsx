import * as React from 'react'
import {Body, Head, Html, Link, Preview, Section, Tailwind, Text} from "@react-email/components";

interface VerificationTemplatesProps {
    domain: string;
    token: string;
}

export function VerificationTemplate({domain, token}: VerificationTemplatesProps) {
    const verificationLink = `${domain}/account/verify?token=${token}`;
    return (
        <Html>
            <Head/>
            <Preview>Account verification</Preview>
            <Tailwind>
                <Body className={'max-w-2xl mx-auto p-6 bg-slate-50'}>
                    <Section className="text-center mb-8">
                        <h1 className={'text-3xl text-black font-bold'}>
                            Confirmation of your email address
                        </h1>
                        <p className={'text-base text-black'}>
                            Thank you for registering with Devoltonstream. To confirm your email address, follow the
                            link:
                        </p>
                        <Link href={verificationLink}
                              className={'inline-flex justify-center items-center rounded-full text-sm font-medium text-white bg-[#18b9ae] px-5 py-2'}>
                            Confirm email address
                        </Link>
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
