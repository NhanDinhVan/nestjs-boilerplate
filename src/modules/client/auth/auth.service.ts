import { SignUpInput } from '@client/auth/interfaces/auth.interface'
import { RESPONSE_MESSAGE } from '@common/constants'
import { PasswordUtil } from '@common/utils'
import { UserEntity } from '@database/postgres/entities/user/user.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class ClientAuthService {
    constructor(private readonly dataSource: DataSource) {}

    async signUp(input: SignUpInput) {
        const { email, password } = input

        const isEmailExisted = await this.dataSource.getRepository(UserEntity).findOne({
            where: {
                email,
            },
        })

        if (isEmailExisted) {
            throw new BadRequestException(RESPONSE_MESSAGE.EMAIL_ALREADY_EXISTED)
        }

        const hashedPassword = await PasswordUtil.hashPassword(password)
        const newUser = this.dataSource.getRepository(UserEntity).create({
            ...input,
            password: hashedPassword,
        })

        await this.dataSource.getRepository(UserEntity).save(newUser)

        return newUser
    }
}
