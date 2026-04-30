import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { APP_ENV, GRAPHQL_CLIENT_PATH } from '@common/constants'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLFormattedError } from 'graphql'
import { config } from './app.config'

export const getGraphqlConfig = (includeModules?: any[]): ApolloDriverConfig => ({
    driver: ApolloDriver,
    path: GRAPHQL_CLIENT_PATH,
    autoSchemaFile: 'schemaClient.gql',
    sortSchema: true,
    playground: false,
    introspection: true,
    csrfPrevention: false,
    allowBatchedHttpRequests: true,
    ...(includeModules && { include: includeModules }),
    plugins:
        config.app.env !== APP_ENV.RELEASE
            ? [ApolloServerPluginLandingPageLocalDefault()]
            : undefined,
    formatError: (error: GraphQLFormattedError) => {
        if (error.extensions?.exception) {
            const ex = error.extensions.exception as any
            return {
                statusCode: ex?.status ?? 500,
                message: ex?.message ?? error.message,
                messageCode: ex?.messageCode ?? 'GRAPHQL_ERROR',
            }
        }
        return {
            statusCode: 500,
            message: error.message,
            messageCode: error.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
        }
    },
})
