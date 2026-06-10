import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import type { User } from '@supabase/supabase-js'

import { AccessToken, AuthUser } from '../auth/auth-user.decorator'
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard'
import { InsightsService } from './insights.service'

@Controller()
@UseGuards(SupabaseAuthGuard)
export class InsightsController {
  constructor(private readonly insights: InsightsService) {}

  @Get('me')
  getMe(@AuthUser() user: User) {
    return {
      id: user.id,
      email: user.email,
    }
  }

  @Post('insights/enhance')
  enhance(@AccessToken() accessToken: string) {
    return this.insights.enhance(accessToken)
  }
}
