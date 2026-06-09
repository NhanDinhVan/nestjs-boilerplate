import { AppExceptionsFilter } from '@common/filters/app-exception.filter'
import { logBootstrapInfo } from '@common/utils/bootstrap.util'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { json } from 'express'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    )

    app.useGlobalFilters(new AppExceptionsFilter())

    // Configure body parser for batched GraphQL requests
    app.use(json({ limit: '20mb' }))

    const port = parseInt(process.env.PORT ?? '3000', 10)
    await app.listen(port)

    logBootstrapInfo(port)
}

void bootstrap()
