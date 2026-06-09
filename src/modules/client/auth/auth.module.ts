import { ClientAuthResolver } from '@client/auth/auth.resolver'
import { ClientAuthService } from '@client/auth/auth.service'
import { ClientUserModule } from '@client/users/user.module'
import { Module } from '@nestjs/common'

@Module({
    imports: [ClientUserModule],
    providers: [ClientAuthService, ClientAuthResolver],
})
export class ClientAuthModule {}
