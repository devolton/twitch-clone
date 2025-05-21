import {ConfigService} from "@nestjs/config";
import {ApolloDriverConfig} from "@nestjs/apollo";
import {IS_DEV_ENV, isDev} from "../../shared/utils/is.dev.util";
import {join} from "path";
import * as process from "node:process";

export function getGraphQLConfig(configService: ConfigService): ApolloDriverConfig {
    const schemaPath = join(process.cwd(), "src/core/graphql/schema.gql");
    console.log(schemaPath);
    return {
        playground: isDev(configService),
        path: configService.getOrThrow<string>("GRAPHQL_PREFIX"),
        autoSchemaFile: schemaPath,
        sortSchema: true,
        context: ({req, res}) => ({req, res})

    };
}