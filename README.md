# ErenVault

Plataforma SaaS de **gestão financeira pessoal**, em homenagem ao gato preto **Eren**. Tema noturno, acentos âmbar e arquitetura moderna para portfólio.

**Autor:** Hiago Henrique Kodato

## Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| **Auth** | Cadastro, login, sessão persistente, rotas protegidas |
| **Transações** | CRUD com filtro por mês (`?mes=AAAA-MM`), resumo do período |
| **Categorias** | Criar, editar e excluir categorias com cor (`/categorias`) |
| **CSV** | Importação de extratos (`Data`, `Descrição`, `Valor`) |
| **Metas** | Objetivos com barra de progresso e prazo |
| **Cartões** | Limite, fatura atual, dias de fechamento/vencimento |
| **Insights** | Conselhos do Eren — análise local (sem API externa de IA) |
| **Relatórios** | Filtro por mês, comparativo vs mês anterior, distribuição por categoria + CSV |
| **Conta** | Nome de exibição, tema e sessão |

## Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS
- **Estado:** TanStack Query, Zustand (tema)
- **Backend (MVP):** Supabase (Auth + PostgreSQL + RLS)
- **Deploy:** Vercel (monorepo → `apps/web`)

## Monorepo

| Pacote | Descrição |
|--------|-----------|
| `apps/web` | Aplicação React |
| `apps/api` | Reservado (NestJS / LLM futuro) |
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
2. Execute as migrations em `supabase/migrations/` **na ordem do nome do arquivo**.
3. Copie URL e anon key para `.env.local` e para a Vercel.

Detalhes: [`docs/SUPABASE.md`](./docs/SUPABASE.md)

## Importar extrato (CSV)

- Formato: [`docs/CSV_IMPORT.md`](./docs/CSV_IMPORT.md)
- Exemplo pronto: [`docs/samples/extrato_exemplo.csv`](./docs/samples/extrato_exemplo.csv)

## Insights financeiros

Análise por regras no navegador (privacidade): [`docs/INSIGHTS.md`](./docs/INSIGHTS.md) · rota `/insights`

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build produção
npm run lint     # ESLint
```

## Licença

Privado — projeto de portfólio.
