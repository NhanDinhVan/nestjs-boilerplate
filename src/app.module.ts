import { ClientModule } from '@client/client.module'
import { PostgresDatasourceModule } from '@database/postgres/datasource.module'
import { Module } from '@nestjs/common'

@Module({
    imports: [ClientModule, PostgresDatasourceModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
