# Contexto Cursor — ErenVault

Documento de referência para continuar o desenvolvimento no Cursor.

---

## Autor e objetivo

| Item | Detalhe |
|------|---------|
| **Desenvolvedor** | Hiago Henrique Kodato |
| **Objetivo** | Portfólio — SaaS de gestão financeira pessoal |
| **Projeto** | ErenVault — homenagem ao gato preto **Eren** (tema noite + olhos âmbar) |
| **Status** | **Fase 4 — Metas** (em andamento) · Fases 1–3 concluídas |

---

## Infraestrutura

| Serviço | Uso |
|---------|-----|
| **Vercel** | Deploy do frontend (`apps/web`) — conta já conectada ao repo |
| **Supabase** | Auth + PostgreSQL + RLS — conta já conectada |

---

## Caminhos locais

- Workspace: `C:\Users\hiago\OneDrive\Documentos\Projetos\erenvault`
- App web: `apps/web/` — rodar `npm run dev` na **raiz** do monorepo

---

## Monorepo

```
erenvault/
  apps/web/          # Vite + React (deploy Vercel)
  apps/api/          # Placeholder — NestJS futuro
  packages/ui/       # Button, cn, button-variants
  packages/types/    # Tipos compartilhados
  supabase/migrations/
```

---

## Stack

- **Vite** + **React 19** + **TypeScript**
- **TailwindCSS** + `@erenvault/ui` (estilo shadcn)
- **React Router** (lazy routes + `Suspense`)
- **TanStack React Query**
- **Zustand** + `persist` (tema)
- **Framer Motion**
- **Supabase JS** (`@supabase/supabase-js`)
- **ESLint** + **Prettier** (`endOfLine: auto` no Windows)

---

## Variáveis de ambiente

Arquivo `apps/web/.env.local` (gitignored). Copiar de `apps/web/.env.example`.

| Variável | Uso |
|----------|-----|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon (pública no front) |

**Vercel:** configurar as mesmas variáveis no dashboard.

**Nunca** expor `service_role` no frontend.

---

## Git — convenções

| Item | Padrão |
|------|--------|
| **Branches** | `main` ← `develop` ← `feature/*` |
| **Commits** | Inglês, Conventional Commits |
| **PRs** | Título e descrição em inglês |
| **Commits** | Só criar quando o usuário pedir explicitamente |

Branch atual sugerida para foundation: `feature/project-foundation`

---

## Roadmap

| Fase | Conteúdo | Status |
|------|----------|--------|
| **1 — Foundation** | Monorepo, tema Eren, layout, landing, Supabase client, migration SQL | Concluída |
| **2 — Auth** | Login, cadastro, sessão, rotas protegidas, perfil | Concluída |
| **3 — Transações** | CRUD, categorias padrão, resumo do mês | Concluída |
| **4 — Metas** | CRUD metas, progresso, resumo no painel | Em andamento |
| **5 — Cartões** | Cartões de crédito | Pendente |
| **5 — Metas e cartões** | Metas, cartões de crédito | Pendente |
| **6 — CSV** | Importação de extratos | Pendente |
| **7 — IA** | Insights financeiros | Pendente |
| **8 — Polish** | Skeletons, a11y, 404, README portfolio | Pendente |

---

## Rotas (atual)

| Rota | Layout | Página |
|------|--------|--------|
| `/` | `RootLayout` | Home (pública) |
| `/login` | `AuthLayout` + `GuestRoute` | Login |
| `/cadastro` | `AuthLayout` + `GuestRoute` | Cadastro |
| `/dashboard` | `RootLayout` + `ProtectedRoute` | Painel com saldo real do mês |
| `/transacoes` | `RootLayout` + `ProtectedRoute` | Lançamentos (CRUD) |
| `/metas` | `RootLayout` + `ProtectedRoute` | Metas financeiras |
| `*` | `RootLayout` | `NotFoundPage` |

Erros: `RootErrorPage` via `errorElement`.

---

## Identidade visual — diferente de Framefy e EasyGo

Objetivo de portfólio: **não repetir** o mesmo “template” entre projetos.

| Projeto | Padrão visual típico | ErenVault (evitar copiar) |
|---------|----------------------|---------------------------|
| **Framefy** | Navbar glass sticky, `container-page`, cards glass, grid 3 colunas, vermelho Netflix | — |
| **EasyGo** | Bootstrap, navbar **topo** teal (`#14b8a6`), `container` central, cards com hover lift, gradientes teal/azul | — |

**ErenVault usa:**

| Aspecto | Escolha |
|---------|---------|
| Navegação | **Sidebar fixa** (desktop) + **bottom nav** (mobile) — não navbar glass no topo |
| Login | **`AuthLayout`** split 50/50 — sem sidebar, sem card central flutuante |
| Tipografia | **Fraunces** (títulos) + **DM Sans** (corpo) — não system-ui só |
| Cor primária | **Âmbar/dourado** (olhos do Eren) — não teal EasyGo nem vermelho Framefy |
| Superfícies | **`.panel` / `.panel-inset`** sólidos — não `.glass` / backdrop blur |
| Fundo | Grade sutil (`eren-app-shell`) — não radial teal+azul do EasyGo |
| Home | Hero editorial + **lista numerada** (roadmap) — não grid de feature cards |
| Motion | Fade simples nas rotas — não slide Y + glass como Framefy |

Tokens e utilitários: `apps/web/src/index.css`.

---

## Tema visual — Eren (gatinho preto)

- **Padrão:** `dark`
- **Primary:** âmbar (`--primary: 251 191 36`)
- **Accent:** teal suave (`--accent: 94 234 212`) — detalhe, não cor de marca principal
- **Componentes:** `ErenLogo`, `ErenMascot` (SVG cofre/gato)
- **Microcopy:** tom leve, profissional (SaaS financeiro)

Tokens em `apps/web/src/index.css`.

---

## Supabase — schema inicial

Migration: `supabase/migrations/20250526000000_initial.sql`

Tabelas: `profiles`, `categories`, `transactions` + RLS + trigger `handle_new_user`.

Aplicar no SQL Editor do Supabase ou via CLI quando configurado.

---

## Arquitetura `apps/web/src/`

```
app/           App.tsx, AppProviders
components/    brand/, layout/, navigation/
features/      auth/context (AuthProvider)
hooks/         useThemeMode, …
layouts/       RootLayout, AuthLayout
pages/         home, auth, errors
routes/        router.tsx, lazyPages.ts
lib/           supabase.ts
stores/        themeStore
utils/         env, theme
```

---

## Decisões de produto

1. MVP usa **Supabase direto do front** com RLS — `apps/api` fica para IA/CSV pesado depois.
2. Tema **dark-first** com opção light.
3. Dados sempre isolados por `auth.uid()` (RLS).
4. `packages/types` espelha o schema do banco.

---

## Scripts (raiz)

```bash
npm install
npm run dev
npm run build
npm run lint
```

---

## Como usar no Cursor

1. Anexar `@CONTEXTO_CURSOR_ERENVAULT.md` no início de sessões novas.
2. Pedir mudanças em português; commits/PRs em inglês.
3. Trabalhar em `feature/*` → PR para `develop` → depois `main`.

---

*ErenVault — Hiago Kodato.*
