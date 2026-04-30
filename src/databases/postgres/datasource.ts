// TypeORM CLI entry point — used ONLY by migration scripts.
// The migration script preloads `dotenv/config` before this module is evaluated,
// so `config` reads correct values from process.env.
//
// IMPORTANT: Never import PostgresDataSource into NestJS modules.
//            NestJS uses PostgresDatasourceModule (TypeOrmModule.forRootAsync) instead.

import { getPostgresDatabaseConfig } from '@config/database.config'
import { DataSource } from 'typeorm'

export const PostgresDataSource = new DataSource(getPostgresDatabaseConfig())
