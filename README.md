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
2. Execute os SQL em `supabase/migrations/` (na ordem dos arquivos).
3. Copie URL e anon key para `.env.local` e para a Vercel.

## Deploy (Vercel)

O `vercel.json` na raiz aponta o build para `apps/web`. Configure as env vars do Supabase no dashboard.

## Importar extrato (CSV)

Veja [`docs/CSV_IMPORT.md`](./docs/CSV_IMPORT.md) para o formato aceito.

## Insights financeiros

Veja [`docs/INSIGHTS.md`](./docs/INSIGHTS.md) — análise local em `/insights`.

## Documentação para o Cursor

Arquivo local `CONTEXTO_CURSOR_ERENVAULT.md` (não versionado) — roadmap e convenções.

## Licença

Privado — projeto de portfólio.
