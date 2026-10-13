-- Validação no banco: o front grava direto no Supabase, então os limites precisam valer aqui também,
-- não só nos formulários. Limites iguais aos do app (apps/web).

alter table public.categories
  add constraint categories_name_len check (char_length(name) between 1 and 40),
  add constraint categories_color_len check (color is null or char_length(color) <= 32);

alter table public.transactions
  add constraint transactions_description_len check (char_length(description) <= 200);

alter table public.goals
  add constraint goals_title_len check (char_length(title) between 1 and 80);

alter table public.credit_cards
  add constraint credit_cards_name_len check (char_length(name) between 1 and 60);

alter table public.profiles
  add constraint profiles_display_name_len check (display_name is null or char_length(display_name) <= 80),
  add constraint profiles_avatar_url_len check (avatar_url is null or char_length(avatar_url) <= 500);

-- Uma transação só pode apontar para categoria do próprio usuário.
-- Antes, a FK só checava se a categoria existia: dava para vincular o id de uma categoria alheia.
alter table public.categories
  add constraint categories_id_user_uq unique (id, user_id);

alter table public.transactions
  drop constraint if exists transactions_category_id_fkey,
  add constraint transactions_category_owner_fkey
    foreign key (category_id, user_id)
    references public.categories (id, user_id)
    on delete set null (category_id);

-- O nome vem do metadata do cadastro (controlado pelo cliente): corta no limite em vez de quebrar o signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), 80)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
