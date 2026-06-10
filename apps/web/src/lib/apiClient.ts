import { getApiUrl } from '@/utils/env'

export type EnhanceInsightsApiResponse = {
  source: 'openai' | 'unconfigured'
  insights: string[]
}

export async function fetchEnhanceInsights(accessToken: string): Promise<EnhanceInsightsApiResponse> {
  const base = getApiUrl()
  if (!base) throw new Error('API não configurada')

  const response = await fetch(`${base.replace(/\/$/, '')}/v1/insights/enhance`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Erro na API (${response.status})`)
  }

  return response.json() as Promise<EnhanceInsightsApiResponse>
}
