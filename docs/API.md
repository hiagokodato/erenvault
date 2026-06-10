# ErenVault API

Backend NestJS em `apps/api`. O frontend continua no Supabase para CRUD; a API cobre lógica de servidor (IA, jobs futuros).

## Subir localmente

```bash
# Raiz do monorepo
npm install
cp apps/api/.env.example apps/api/.env
# Preencher SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

npm run dev:api
```

- Health: http://localhost:3001/v1/health  
- Com front: `VITE_API_URL=http://localhost:3001` em `apps/web/.env.local`

## Autenticação

Rotas protegidas exigem header:

```
Authorization: Bearer <access_token>
```

O token é o `session.access_token` do Supabase Auth (mesmo do login no app).

## Endpoints

### `GET /v1/health`

Público. Retorna `{ status, service, openaiConfigured }`.

### `GET /v1/me`

Retorna `{ id, email }` do usuário autenticado.

### `POST /v1/insights/enhance`

Agrega dados do mês (transações, metas, cartões) com RLS do usuário e:

- Com `OPENAI_API_KEY`: gera até 4 conselhos via OpenAI (`source: "openai"`).
- Sem chave: mensagem informativa (`source: "unconfigured"`).

## Deploy

- **Railway / Render / Fly**: build `npm run build -w @erenvault/api`, start `node dist/main.js` em `apps/api`.
- Variáveis iguais ao `.env.example`.
- `CORS_ORIGIN` = URL do app na Vercel.

Nunca commitar `SUPABASE_SERVICE_ROLE_KEY` nem `OPENAI_API_KEY`.
