# Supabase — ErenVault

## 1. Variáveis (local e Vercel)

| Variável | Valor |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://tvlwsugffijigzlxszmw.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | **Publishable** (`sb_publishable_...`) ou **Legacy anon** (`eyJ...`) |

Arquivo local: `apps/web/.env.local` (não commitar).

Na **Vercel**: Settings → Environment Variables → mesmas chaves → Redeploy.

## 2. Banco de dados

No painel Supabase → **SQL Editor** → executar:

`supabase/migrations/20250526000000_initial.sql`  
`supabase/migrations/20250526100000_goals.sql` (metas)  
`supabase/migrations/20250526200000_credit_cards.sql` (cartões)  
`supabase/migrations/20250526300000_categories_unique.sql` (índice único em categorias)  
`supabase/migrations/20250526400000_category_monthly_budget.sql` (orçamento mensal por categoria)

Se já existirem categorias duplicadas, deduplique antes de rodar a última migration.

## 3. Autenticação (família)

**Authentication → Providers → Email** → habilitado.

Para cadastro sem e-mail de confirmação (recomendado para família no início):

**Authentication → Providers → Email** → desmarcar **Confirm email**.

## 4. URLs de redirect

**Authentication → URL Configuration**:

- **Site URL**: `https://erenvault.vercel.app`
- **Redirect URLs**: `http://localhost:5173/**` e `https://erenvault.vercel.app/**`

## 5. Testar

```bash
npm install
npm run dev
```

- `/cadastro` — criar conta  
- `/login` — entrar  
- `/dashboard` — painel (logado)
