import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  const port = config.get<number>('PORT', 3001)
  const corsOrigin = config.get<string>('CORS_ORIGIN', 'http://localhost:5173')

  app.setGlobalPrefix('v1')
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  })

  await app.listen(port)
  Logger.log(`ErenVault API listening on http://localhost:${port}/v1`, 'Bootstrap')
}

bootstrap()
