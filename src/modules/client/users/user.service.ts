import { UserEntity } from '@database/postgres/entities/user/user.entity'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { IUpdateUserInput } from './interfaces'

@Injectable()
export class ClientUserService {
    constructor(private readonly _dataSource: DataSource) {}

    async findAll(): Promise<UserEntity[]> {
        return this._dataSource.getRepository(UserEntity).find()
    }

    async update(id: string, input: IUpdateUserInput): Promise<UserEntity> {
        const user = await this._dataSource.getRepository(UserEntity).findOne({ where: { id } })

        if (!user) {
            throw new Error('User not found')
        }

        if (input.firstName !== undefined) user.firstName = input.firstName
        if (input.lastName !== undefined) user.lastName = input.lastName
        if (input.dayOfBirth !== undefined) {
            user.dayOfBirth = input.dayOfBirth ?? null
        }

        return this._dataSource.getRepository(UserEntity).save(user)
    }
}
