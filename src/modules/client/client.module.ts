import { getGraphqlConfig } from '@config/graphql.config'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ClientUserModule } from './users/user.module'

const clientModules = [ClientUserModule]

@Module({
    providers: [],
    imports: [...clientModules, GraphQLModule.forRoot(getGraphqlConfig(clientModules))],
})
export class ClientModule {}
