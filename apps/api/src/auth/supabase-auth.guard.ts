import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import type { AuthenticatedRequest } from './auth.types'
import { SupabaseService } from './supabase.service'

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const header = request.headers.authorization

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de acesso ausente.')
    }

    const accessToken = header.slice(7).trim()
    if (!accessToken) {
      throw new UnauthorizedException('Token de acesso inválido.')
    }

    const user = await this.supabase.getUserFromAccessToken(accessToken)
    if (!user) {
      throw new UnauthorizedException('Sessão inválida ou expirada.')
    }

    request.user = user
    request.accessToken = accessToken
    return true
  }
}
