import { ClientModule } from '@client/client.module'
import { AppExceptionsFilter } from '@common/filters'
import { PostgresDatasourceModule } from '@database/postgres/datasource.module'
import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

@Module({
    imports: [ClientModule, PostgresDatasourceModule],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AppExceptionsFilter,
        },
    ],
})
export class AppModule {}
