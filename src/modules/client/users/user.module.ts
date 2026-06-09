import { Module } from '@nestjs/common'
import { ClientUserResolver } from './user.resolver'
import { ClientUserService } from './user.service'

@Module({
    providers: [ClientUserResolver, ClientUserService],
    exports: [ClientUserService],
})
export class ClientUserModule {}
