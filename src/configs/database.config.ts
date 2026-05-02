import path from 'node:path'
import { config } from '@config/app.config'
import { DataSourceOptions, LoggerOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const isTsNode = !!(process as NodeJS.Process & { [key: symbol]: unknown })[
    Symbol.for('ts-node.register.instance')
]

// Never log queries in release — they may contain PII
const LOGGING_MAP: Record<string, LoggerOptions> = {
    local: ['query', 'error', 'warn', 'schema', 'log'],
    staging: ['error', 'warn', 'schema'],
    uat: ['error', 'warn', 'schema'],
    release: ['error'],
}

export const getPostgresDatabaseConfig = (): DataSourceOptions => {
    const env = config.app.env
    const isRelease = env === 'release'
    const isSslEnabled = config.database.ssl
    const logging: LoggerOptions = LOGGING_MAP[env] ?? ['error']

    // SSL as object form (not boolean): rejectUnauthorized=true enforces CA cert in release
    const sslOption = isSslEnabled ? { ssl: { rejectUnauthorized: isRelease } } : {}

    return {
        type: 'postgres',
        host: config.database.host,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        database: config.database.database,

        synchronize: false,
        logging,
        logger: 'advanced-console',
        entities: [
            path.join(
                __dirname,
                isTsNode
                    ? '../databases/postgres/entities/**/*.entity.ts'
                    : '../databases/postgres/entities/**/*.entity.js',
            ),
        ],

        migrations: [
            path.join(
                __dirname,
                isTsNode
                    ? '../databases/postgres/migrations/*.ts'
                    : '../databases/postgres/migrations/*.js',
            ),
        ],
        migrationsTableName: 'typeorm_migrations',
        namingStrategy: new SnakeNamingStrategy(),

        extra: {
            max: config.database.poolSize,
            idleTimeoutMillis: config.database.idleTimeoutMs,
            connectionTimeoutMillis: config.database.connectionTimeoutMs,
        },

        ...sslOption,
    }
}
