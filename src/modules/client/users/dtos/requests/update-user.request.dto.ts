import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateUserRequestDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Field({ nullable: true })
    firstName?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Field({ nullable: true })
    lastName?: string

    @IsOptional()
    @IsDate()
    @Field(() => Date, { nullable: true })
    dayOfBirth?: Date | null
}
