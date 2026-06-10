import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { SupabaseClient } from '@supabase/supabase-js'

import { SupabaseService } from '../auth/supabase.service'
import { getCurrentMonthRange, getPreviousMonthRange } from '../utils/dates'
import { formatBrl, summarizeTransactions } from '../utils/money'
import type { EnhanceInsightsResponse, InsightContextPayload } from './insights.types'

@Injectable()
export class InsightsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {}

  async enhance(accessToken: string): Promise<EnhanceInsightsResponse> {
    const client = this.supabase.createUserClient(accessToken)
    const context = await this.buildContext(client)

    const apiKey = this.config.get<string>('OPENAI_API_KEY')
    if (!apiKey) {
      return {
        source: 'unconfigured',
        insights: [
          'A API está no ar, mas OPENAI_API_KEY não foi configurada no servidor.',
          'Os Conselhos do Eren no app continuam funcionando localmente no navegador.',
        ],
      }
    }

    const insights = await this.generateWithOpenAI(context, apiKey)
    return { source: 'openai', insights }
  }

  private async buildContext(client: SupabaseClient): Promise<InsightContextPayload> {
    const currentRange = getCurrentMonthRange()
    const previousRange = getPreviousMonthRange()

    const [currentTx, previousTx, goals, cards, categories] = await Promise.all([
      this.fetchTransactions(client, currentRange.from, currentRange.to),
      this.fetchTransactions(client, previousRange.from, previousRange.to),
      this.fetchGoals(client),
      this.fetchCards(client),
      this.fetchCategories(client),
    ])

    const current = summarizeTransactions(currentTx)
    const previous = summarizeTransactions(previousTx)
    const topCategory = this.getTopExpenseCategory(currentTx, categories)

    const cardsSummary = cards.reduce(
      (acc, c) => ({
        limit: acc.limit + c.limit_cents,
        used: acc.used + c.balance_cents,
      }),
      { limit: 0, used: 0 },
    )

    const totalCardUsagePercent =
      cardsSummary.limit > 0 ? Math.round((cardsSummary.used / cardsSummary.limit) * 100) : 0

    const cardsHighUsage = cards.filter(
      (c) => c.limit_cents > 0 && Math.round((c.balance_cents / c.limit_cents) * 100) >= 80,
    ).length

    const cardsOverLimit = cards.filter((c) => c.balance_cents > c.limit_cents).length

    const goalsCompleted = goals.filter((g) => g.saved_amount_cents >= g.target_amount_cents).length

    return {
      monthLabel: currentRange.label,
      incomeBrl: formatBrl(current.incomeCents),
      expenseBrl: formatBrl(current.expenseCents),
      balanceBrl: formatBrl(current.balanceCents),
      transactionCount: current.count,
      previousExpenseBrl: formatBrl(previous.expenseCents),
      topCategoryName: topCategory.name,
      topCategoryShare: topCategory.share,
      goalsTotal: goals.length,
      goalsCompleted,
      goalsNearDeadline: 0,
      cardsHighUsage,
      cardsOverLimit,
      totalCardUsagePercent,
    }
  }

  private async fetchTransactions(client: SupabaseClient, from: string, to: string) {
    const { data, error } = await client
      .from('transactions')
      .select('type, amount_cents, category_id')
      .gte('occurred_on', from)
      .lte('occurred_on', to)

    if (error) throw error
    return data ?? []
  }

  private async fetchGoals(client: SupabaseClient) {
    const { data, error } = await client
      .from('goals')
      .select('target_amount_cents, saved_amount_cents, deadline')

    if (error) throw error
    return data ?? []
  }

  private async fetchCards(client: SupabaseClient) {
    const { data, error } = await client
      .from('credit_cards')
      .select('limit_cents, balance_cents')

    if (error) throw error
    return data ?? []
  }

  private async fetchCategories(client: SupabaseClient) {
    const { data, error } = await client.from('categories').select('id, name')
    if (error) throw error
    return data ?? []
  }

  private getTopExpenseCategory(
    transactions: { type: string; amount_cents: number; category_id: string | null }[],
    categories: { id: string; name: string }[],
  ) {
    const expenses = transactions.filter((t) => t.type === 'expense')
    const total = expenses.reduce((sum, t) => sum + t.amount_cents, 0)
    if (total === 0) return { name: null as string | null, share: 0 }

    const byCategory = new Map<string, number>()
    for (const t of expenses) {
      const key = t.category_id ?? '__none__'
      byCategory.set(key, (byCategory.get(key) ?? 0) + t.amount_cents)
    }

    let topKey = ''
    let topAmount = 0
    for (const [key, amount] of byCategory) {
      if (amount > topAmount) {
        topKey = key
        topAmount = amount
      }
    }

    const name =
      topKey === '__none__'
        ? 'Sem categoria'
        : (categories.find((c) => c.id === topKey)?.name ?? 'Outros')

    return { name, share: Math.round((topAmount / total) * 100) }
  }

  private async generateWithOpenAI(
    context: InsightContextPayload,
    apiKey: string,
  ): Promise<string[]> {
    const model = this.config.get<string>('OPENAI_MODEL', 'gpt-4o-mini')

    const prompt = `Você é o Eren, um gato preto sábio que aconselha finanças pessoais no app ErenVault.
Tom: leve, profissional, em português do Brasil. Máximo 4 conselhos curtos (2 frases cada).
Use apenas os dados abaixo — não invente valores.

Mês: ${context.monthLabel}
Entradas: ${context.incomeBrl}
Saídas: ${context.expenseBrl}
Saldo: ${context.balanceBrl}
Lançamentos no mês: ${context.transactionCount}
Saídas mês anterior: ${context.previousExpenseBrl}
Categoria que mais gastou: ${context.topCategoryName ?? 'n/d'} (${context.topCategoryShare}%)
Metas: ${context.goalsCompleted}/${context.goalsTotal} concluídas
Uso dos cartões: ${context.totalCardUsagePercent}% do limite total
Cartões com uso ≥80%: ${context.cardsHighUsage}
Cartões acima do limite: ${context.cardsOverLimit}

Responda em JSON: { "insights": ["...", "..."] }`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Responda somente JSON válido em português.' },
          { role: 'user', content: prompt },
        ],
      }),
    })

    if (!response.ok) {
      throw new ServiceUnavailableException('Falha ao consultar o modelo de IA.')
    }

    const body = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }

    const content = body.choices?.[0]?.message?.content
    if (!content) {
      throw new ServiceUnavailableException('Resposta vazia do modelo de IA.')
    }

    const parsed = JSON.parse(content) as { insights?: string[] }
    if (!Array.isArray(parsed.insights) || parsed.insights.length === 0) {
      throw new ServiceUnavailableException('Formato de resposta inválido.')
    }

    return parsed.insights.slice(0, 4)
  }
}
