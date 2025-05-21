import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts')

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*',
            },
            {
                source: '/graphql/:path*',
                destination: 'http://localhost:3001/graphql/:path*',
            }
        ]
    },
    reactStrictMode: true
};

export default withNextIntl(nextConfig);
