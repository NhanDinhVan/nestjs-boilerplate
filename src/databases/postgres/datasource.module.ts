import { getPostgresDatabaseConfig } from '@config/database.config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                ...getPostgresDatabaseConfig(),
                autoLoadEntities: true,
            }),
        }),
    ],
})
export class PostgresDatasourceModule {}
