import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { User } from '@supabase/supabase-js'

import type { AuthenticatedRequest } from './auth.types'

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>()
    return request.user
  },
)

export const AccessToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>()
    return request.accessToken
  },
)
