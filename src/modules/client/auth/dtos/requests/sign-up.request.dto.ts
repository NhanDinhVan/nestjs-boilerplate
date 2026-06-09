import { IsPasswordValid } from '@common/validators'
import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsEmail, IsNotEmpty } from 'class-validator'

@InputType()
export class ClientSignUpRequestDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field(() => String)
    @IsNotEmpty()
    @IsPasswordValid()
    password: string

    @Field(() => String)
    @IsNotEmpty()
    firstName: string

    @Field(() => String)
    @IsNotEmpty()
    lastName: string

    @Field(() => Date)
    @IsNotEmpty()
    @IsDate()
    dayOfBirth: Date
}
