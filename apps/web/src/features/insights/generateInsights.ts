import { formatCurrency } from '@/utils/money'

import type { FinancialInsight, InsightContext } from './types'

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 100)
}

export function generateInsights(ctx: InsightContext): FinancialInsight[] {
  const insights: FinancialInsight[] = []

  if (ctx.transactionCount === 0) {
    insights.push({
      id: 'no-transactions',
      title: 'Cofre vazio este mês',
      body: 'Registre entradas e saídas em Transações — ou importe um CSV — para o Eren analisar seus hábitos.',
      tone: 'neutral',
    })
    return insights
  }

  if (ctx.balanceCents >= 0) {
    const savingsRate =
      ctx.incomeCents > 0 ? Math.round((ctx.balanceCents / ctx.incomeCents) * 100) : 0

    if (savingsRate >= 20) {
      insights.push({
        id: 'strong-savings',
        title: 'Boa reserva no mês',
        body: `Você guardou cerca de ${savingsRate}% das entradas (${formatCurrency(ctx.balanceCents)}). O Eren aprova esse ritmo.`,
        tone: 'positive',
      })
    } else if (ctx.balanceCents > 0) {
      insights.push({
        id: 'positive-balance',
        title: 'Saldo positivo',
        body: `Entradas superaram saídas em ${formatCurrency(ctx.balanceCents)} neste mês. Pequenos passos contam.`,
        tone: 'positive',
      })
    }
  } else {
    insights.push({
      id: 'negative-balance',
      title: 'Gastos acima das entradas',
      body: `Saídas passaram entradas em ${formatCurrency(Math.abs(ctx.balanceCents))}. Vale revisar os maiores gastos do mês.`,
      tone: 'warning',
    })
  }

  const expenseChange = pctChange(ctx.expenseCents, ctx.previousExpenseCents)
  if (expenseChange !== null && expenseChange >= 15) {
    insights.push({
      id: 'expense-up',
      title: 'Saídas em alta',
      body: `Despesas subiram ${expenseChange}% em relação ao mês anterior. Confira se há lançamentos extras ou parcelas.`,
      tone: 'warning',
    })
  } else if (expenseChange !== null && expenseChange <= -10) {
    insights.push({
      id: 'expense-down',
      title: 'Saídas controladas',
      body: `Você gastou ${Math.abs(expenseChange)}% a menos que no mês passado. Continue observando o padrão.`,
      tone: 'positive',
    })
  }

  if (ctx.topCategoryName && ctx.topCategoryShare >= 35) {
    insights.push({
      id: 'top-category',
      title: `Foco em ${ctx.topCategoryName}`,
      body: `${ctx.topCategoryShare}% das saídas do mês estão em “${ctx.topCategoryName}”. Se quiser economizar, comece por aí.`,
      tone: ctx.topCategoryShare >= 50 ? 'warning' : 'neutral',
    })
  }

  if (ctx.goalsTotal > 0) {
    if (ctx.goalsCompleted === ctx.goalsTotal) {
      insights.push({
        id: 'all-goals-done',
        title: 'Todas as metas batidas',
        body: 'Parabéns — você concluiu todas as metas cadastradas. Hora de definir o próximo objetivo?',
        tone: 'positive',
      })
    } else if (ctx.goalsNearDeadline > 0) {
      insights.push({
        id: 'goals-deadline',
        title: 'Metas com prazo apertado',
        body: `${ctx.goalsNearDeadline} meta(s) com prazo próximo e menos de metade guardada. Veja em Metas o que falta.`,
        tone: 'warning',
      })
    } else {
      insights.push({
        id: 'goals-progress',
        title: 'Metas em andamento',
        body: `${ctx.goalsCompleted} de ${ctx.goalsTotal} metas concluídas. Guardar um pouco por mês ajuda a chegar lá.`,
        tone: 'neutral',
      })
    }
  }

  if (ctx.cardsOverLimit > 0) {
    insights.push({
      id: 'cards-over-limit',
      title: 'Cartão acima do limite',
      body: `${ctx.cardsOverLimit} cartão(ões) com fatura acima do limite. Priorize o pagamento para evitar juros.`,
      tone: 'warning',
    })
  } else if (ctx.cardsHighUsage > 0) {
    insights.push({
      id: 'cards-high-usage',
      title: 'Limite de cartão alto',
      body: `${ctx.cardsHighUsage} cartão(ões) com mais de 80% do limite usado. Deixe margem para imprevistos.`,
      tone: 'warning',
    })
  } else if (ctx.totalCardUsagePercent > 0 && ctx.totalCardUsagePercent < 40) {
    insights.push({
      id: 'cards-healthy',
      title: 'Crédito sob controle',
      body: `Uso total dos cartões em ${ctx.totalCardUsagePercent}% do limite combinado. Boa folga no crédito.`,
      tone: 'positive',
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: 'steady-month',
      title: 'Mês equilibrado',
      body: 'Nada urgente por aqui. Continue registrando lançamentos para insights mais precisos.',
      tone: 'neutral',
    })
  }

  return insights
}

export function sortInsightsByPriority(insights: FinancialInsight[]): FinancialInsight[] {
  const order = { warning: 0, neutral: 1, positive: 2 }
  return [...insights].sort((a, b) => order[a.tone] - order[b.tone])
}
