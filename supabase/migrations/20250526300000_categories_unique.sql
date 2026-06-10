-- Evita categorias duplicadas por usuário (import CSV / seed)

create unique index if not exists categories_user_name_uq
  on public.categories (user_id, name);
