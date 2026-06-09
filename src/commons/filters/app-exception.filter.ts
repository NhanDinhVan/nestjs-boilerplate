import { RESPONSE_MESSAGE } from '@common/constants'
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { GraphQLError } from 'graphql'
import { EntityNotFoundError, QueryFailedError } from 'typeorm'

interface NormalizedError {
    statusCode: number
    message: string
}

function extractHttpMessage(response: string | object): string {
    if (typeof response === 'string') return response
    if ('message' in response) {
        const msg = (response as Record<string, unknown>).message
        return Array.isArray(msg) ? String(msg[0]) : String(msg)
    }
    return RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
}

function handleHttpException(exception: HttpException): NormalizedError {
    const statusCode = exception.getStatus()
    const message = extractHttpMessage(exception.getResponse())
    return { statusCode, message }
}

function handleTypeOrmException(exception: Error): NormalizedError {
    if (exception instanceof QueryFailedError) {
        const pgCode = (exception as QueryFailedError & { code?: string }).code
        if (pgCode === '23505') {
            return {
                statusCode: HttpStatus.CONFLICT,
                message: 'Resource already exists',
            }
        }
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
        }
    }
    if (exception instanceof EntityNotFoundError) {
        return {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Resource not found',
        }
    }
    return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    }
}

function handleUnknownException(_exception: unknown): NormalizedError {
    return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
    }
}

function resolveError(exception: unknown): NormalizedError {
    if (exception instanceof HttpException) return handleHttpException(exception)
    if (exception instanceof QueryFailedError || exception instanceof EntityNotFoundError) {
        return handleTypeOrmException(exception)
    }
    return handleUnknownException(exception)
}

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AppExceptionsFilter.name)

    catch(exception: unknown, host: ArgumentsHost): void {
        const errorMessage = exception instanceof Error ? exception.message : String(exception)
        const stack = exception instanceof Error ? exception.stack : undefined

        this.logger.error({
            type: exception?.constructor?.name ?? 'UnknownError',
            message: errorMessage,
            stack,
        })

        const normalized = resolveError(exception)

        if (host.getType<'http' | 'graphql'>() === 'graphql') {
            throw new GraphQLError(normalized.message, {
                extensions: {
                    statusCode: normalized.statusCode,
                },
            })
        }

        const response = host.switchToHttp().getResponse<Response>()
        response.status(normalized.statusCode).json({
            ...normalized,
            timestamp: new Date().toISOString(),
        })
    }
}
