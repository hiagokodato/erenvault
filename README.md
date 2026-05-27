# ErenVault

Plataforma SaaS de **gestão financeira pessoal**, em homenagem ao gato preto **Eren**. Tema noturno, acentos âmbar e arquitetura moderna para portfólio.

## Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS
- **Backend (MVP):** Supabase (Auth + PostgreSQL + RLS)
- **Deploy:** Vercel (web)

## Monorepo

| Pacote | Descrição |
|--------|-----------|
| `apps/web` | Aplicação React |
| `apps/api` | Reservado (NestJS futuro) |
| `packages/ui` | Componentes compartilhados |
| `packages/types` | Tipos TypeScript |

## Começar

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
# Preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

## Supabase

1. Crie um projeto no [Supabase](https://supabase.com).
2. Execute o SQL em `supabase/migrations/20250526000000_initial.sql`.
3. Copie URL e anon key para `.env.local` e para a Vercel.

## Deploy (Vercel)

O `vercel.json` na raiz aponta o build para `apps/web`. Configure as env vars do Supabase no dashboard.

## Documentação para o Cursor

Veja [`CONTEXTO_CURSOR_ERENVAULT.md`](./CONTEXTO_CURSOR_ERENVAULT.md) para roadmap, convenções e decisões.

## Licença

Privado — projeto de portfólio.
