import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UpdateUserRequestDto } from './dtos/requests'
import { UserResponseDto } from './dtos/responses'
import { ClientUserService } from './user.service'

@Resolver(() => UserResponseDto)
export class ClientUserResolver {
    constructor(private readonly _userService: ClientUserService) {}

    @Query(() => [UserResponseDto])
    async getAllUsers(): Promise<UserResponseDto[]> {
        return this._userService.findAll()
    }

    @Mutation(() => UserResponseDto)
    async updateUser(
        @Args('id', { type: () => ID }) id: string,
        @Args('input') input: UpdateUserRequestDto,
    ): Promise<UserResponseDto> {
        return this._userService.update(id, input)
    }
}
