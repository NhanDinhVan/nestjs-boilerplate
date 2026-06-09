import { PASSWORD_REGEX } from '@common/constants'
import { config } from '@config/app.config'
import * as bcrypt from 'bcrypt'

export class PasswordUtil {
    static hashPassword(password: string) {
        const saltRounds = config.jwt.saltRounds

        return bcrypt.hash(password, saltRounds)
    }

    static comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash)
    }

    static validatePassword(password: string) {
        return PASSWORD_REGEX.test(password)
    }
}
