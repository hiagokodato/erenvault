import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'erenvault-api',
      openaiConfigured: Boolean(this.config.get<string>('OPENAI_API_KEY')),
    }
  }
}
