import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

@Injectable()
export class SupabaseService {
  private readonly url: string
  private readonly anonKey: string
  private readonly serviceRoleKey: string

  constructor(private readonly config: ConfigService) {
    this.url = this.config.getOrThrow<string>('SUPABASE_URL')
    this.anonKey = this.config.getOrThrow<string>('SUPABASE_ANON_KEY')
    this.serviceRoleKey = this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY')
  }

  /** Valida JWT e retorna o usuário (service role, só no servidor). */
  async getUserFromAccessToken(accessToken: string): Promise<User | null> {
    const admin = createClient(this.url, this.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data, error } = await admin.auth.getUser(accessToken)
    if (error || !data.user) return null

    return data.user
  }

  /** Cliente com JWT do usuário — respeita RLS. */
  createUserClient(accessToken: string): SupabaseClient {
    return createClient(this.url, this.anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    })
  }
}
