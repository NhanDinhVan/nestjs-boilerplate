import { Query, Resolver } from '@nestjs/graphql'
import { ClientUserService } from './user.service'

@Resolver()
export class ClientUserResolver {
    constructor(private readonly userService: ClientUserService) {}

    @Query(() => String)
    hello() {
        return 'Hello, World!'
    }
}
