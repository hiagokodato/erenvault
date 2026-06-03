# @erenvault/api

API **NestJS** do ErenVault — autenticação Supabase, insights com LLM opcional.

## Endpoints (`/v1`)

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/health` | Não | Status da API |
| `GET` | `/me` | Bearer JWT | Usuário autenticado |
| `POST` | `/insights/enhance` | Bearer JWT | Conselhos do Eren via OpenAI (se configurado) |

## Configuração

```bash
cd apps/api
cp .env.example .env
# Preencher SUPABASE_* e opcionalmente OPENAI_API_KEY
```

Na raiz do monorepo:

```bash
npm install
npm run dev:api
```

API em http://localhost:3001/v1/health

## Variáveis

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `SUPABASE_URL` | Sim | Projeto Supabase |
| `SUPABASE_ANON_KEY` | Sim | Cliente com RLS por usuário |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Validar JWT (só servidor) |
| `OPENAI_API_KEY` | Não | Insights com LLM |
| `CORS_ORIGIN` | Não | Default `http://localhost:5173` |

O **apps/web** continua usando Supabase direto para CRUD. A API entra para **IA no servidor** e evoluções futuras (jobs CSV, webhooks).

Documentação: [`docs/API.md`](../../docs/API.md)
