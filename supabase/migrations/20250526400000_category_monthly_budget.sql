-- Orçamento mensal opcional por categoria (limite de gastos)

alter table public.categories
  add column if not exists monthly_budget_cents bigint
  check (monthly_budget_cents is null or monthly_budget_cents >= 0);
