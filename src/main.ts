import { logBootstrapInfo } from '@common/utils/bootstrap.util'
import { NestFactory } from '@nestjs/core'
import { json } from 'express'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // Configure body parser for batched GraphQL requests
    app.use(json({ limit: '20mb' }))

    const port = parseInt(process.env.PORT ?? '3000', 10)
    await app.listen(port)

    logBootstrapInfo(port)
}

void bootstrap()
