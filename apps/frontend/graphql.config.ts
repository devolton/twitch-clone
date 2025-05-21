import type {CodegenConfig} from "@graphql-codegen/cli";
import 'dotenv/config'

const config: CodegenConfig = {
    schema: process.env.CODEGEN_SERVER_URL,
    documents: ['./graphql/**/*.{graphql,ts,tsx,gql}'],
    generates: {
        './graphql/generated/output.ts': {
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo']
        }
    },
    ignoreNoDocuments: true,
    config: {
        withHooks: true, // генерировать useQuery/useMutation хуки
        withComponent: false,
        withHOC: false
    }

}

export default config;