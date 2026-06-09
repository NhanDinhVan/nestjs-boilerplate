import { ClientAuthService } from '@client/auth/auth.service'
import { ClientSignUpRequestDto } from '@client/auth/dtos/requests'
import { UserResponseDto } from '@client/users/dtos/responses'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

@Resolver()
export class ClientAuthResolver {
    constructor(private readonly clientAuthService: ClientAuthService) {}

    @Mutation(() => UserResponseDto)
    async signUp(@Args('input') input: ClientSignUpRequestDto) {
        return await this.clientAuthService.signUp(input)
    }
}
