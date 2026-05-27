# Insights financeiros — ErenVault

## O que é

A página **Conselhos do Eren** (`/insights`) analisa seus dados e sugere ações práticas — saldo do mês, comparação com o mês anterior, categorias de gasto, metas e cartões.

## Como funciona

- **100% local no navegador** — nenhum dado é enviado para APIs de IA externas.
- Motor de regras em `apps/web/src/features/insights/`.
- Fontes: transações (mês atual e anterior), metas, cartões e categorias.

## Exemplos de insights

| Situação | Conselho |
|----------|----------|
| Saldo negativo | Alerta de gastos acima das entradas |
| Taxa de poupança ≥ 20% | Reforço positivo |
| Saídas +15% vs mês anterior | Aviso de alta de despesas |
| Categoria > 35% dos gastos | Sugestão de foco |
| Meta com prazo e < 50% | Lembrete em Metas |
| Cartão > 80% do limite | Alerta de crédito |

## Evolução futura

`apps/api` pode integrar um LLM (OpenAI, etc.) para textos mais ricos — mantendo a chave no backend.
