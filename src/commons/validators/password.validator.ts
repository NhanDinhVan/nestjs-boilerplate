import { RESPONSE_MESSAGE } from '@common/constants'
import { PasswordUtil } from '@common/utils'
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'validatePassword', async: false })
class ValidatePasswordConstraint implements ValidatorConstraintInterface {
    validate(password: string): boolean {
        return PasswordUtil.validatePassword(password)
    }

    defaultMessage(): string {
        return RESPONSE_MESSAGE.PASSWORD_NOT_VALID
    }
}

export function IsPasswordValid(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: ValidatePasswordConstraint,
        })
    }
}
