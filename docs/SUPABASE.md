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
`supabase/migrations/20250526100000_goals.sql` (metas — Fase 4)

## 3. Autenticação (família)

**Authentication → Providers → Email** → habilitado.

Para cadastro sem e-mail de confirmação (recomendado para família no início):

**Authentication → Providers → Email** → desmarcar **Confirm email**.

## 4. URLs de redirect

**Authentication → URL Configuration**:

- **Site URL**: URL da Vercel em produção (ex. `https://seu-app.vercel.app`)
- **Redirect URLs**: adicionar `http://localhost:5173/**` e `https://seu-app.vercel.app/**`

## 5. Testar

```bash
npm install
npm run dev
```

- `/cadastro` — criar conta  
- `/login` — entrar  
- `/dashboard` — painel (logado)
