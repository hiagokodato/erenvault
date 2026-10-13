import {
  type CanActivate,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'

import type { AuthenticatedRequest } from '../auth/auth.types'

const WINDOW_MS = 10 * 60 * 1000
const MAX_CALLS = 5

/**
 * Limita chamadas à OpenAI por usuário (5 a cada 10 min): cada chamada custa dinheiro.
 * Em memória — suficiente para uma instância; com várias, troque por Redis.
 * Precisa rodar depois do SupabaseAuthGuard (usa request.user).
 */
@Injectable()
export class InsightsRateLimitGuard implements CanActivate {
  private readonly calls = new Map<string, number[]>()

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const userId = request.user.id
    const now = Date.now()

    const recent = (this.calls.get(userId) ?? []).filter((at) => now - at < WINDOW_MS)
    if (recent.length >= MAX_CALLS) {
      throw new HttpException(
        'Limite de conselhos por IA atingido. Tente de novo em alguns minutos.',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    recent.push(now)
    this.calls.set(userId, recent)
    return true
  }
}
