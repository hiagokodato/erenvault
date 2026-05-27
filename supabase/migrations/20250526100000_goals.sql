-- Metas financeiras (Fase 4)

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  target_amount_cents bigint not null check (target_amount_cents > 0),
  saved_amount_cents bigint not null default 0 check (saved_amount_cents >= 0),
  deadline date,
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "goals_all_own" on public.goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists goals_user_id_idx on public.goals (user_id);
