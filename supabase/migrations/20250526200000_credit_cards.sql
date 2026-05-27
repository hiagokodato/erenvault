-- Cartões de crédito (Fase 5)

create table if not exists public.credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  limit_cents bigint not null check (limit_cents > 0),
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  closing_day smallint not null check (closing_day between 1 and 31),
  due_day smallint not null check (due_day between 1 and 31),
  created_at timestamptz not null default now()
);

alter table public.credit_cards enable row level security;

create policy "credit_cards_all_own" on public.credit_cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists credit_cards_user_id_idx on public.credit_cards (user_id);
