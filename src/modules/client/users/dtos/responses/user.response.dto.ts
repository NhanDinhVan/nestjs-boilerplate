import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserResponseDto {
    @Field(() => ID)
    id: string

    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field()
    email: string

    @Field(() => Date, { nullable: true })
    dayOfBirth: Date | null

    @Field(() => Date, { nullable: true })
    createdAt: Date | null

    @Field(() => Date, { nullable: true })
    updatedAt: Date | null
}
