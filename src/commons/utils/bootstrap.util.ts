import { GRAPHQL_CLIENT_PATH } from '@common/constants/app.constant'
import { config } from '@config/app.config'

export const logBootstrapInfo = (port: number): void => {
    const { database } = config
    const { app } = config

    console.log('\n' + '='.repeat(60))
    console.log('🚀 Application Bootstrap')
    console.log('='.repeat(60))
    console.log(`📍 Environment: ${app.env}`)
    console.log(`🔗 GraphQL Client: http://localhost:${port}${GRAPHQL_CLIENT_PATH}`)
    console.log(`🗄️  Database: ${database.host}:${database.port}/${database.database}`)
    console.log(`👤 DB User: ${database.username}`)
    console.log(`🔒 SSL: ${database.ssl ? 'enabled' : 'disabled'}`)
    console.log('='.repeat(60) + '\n')
}
