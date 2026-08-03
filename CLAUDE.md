@AGENTS.md

# OutOfBox — Contexto do Projeto

> ⚠️ **graphify**: Se `graphify-out/graph.json` não existir, corre `graphify .` antes de explorar o código. Após alterações: `graphify update .`

## Stack
- **Next.js 16.2.1** (ver AGENTS.md — APIs diferem do standard)
- **next-auth v5 beta** (`^5.0.0-beta.30`) — usar `AUTH_SECRET` e `AUTH_URL`, não `NEXTAUTH_*`
- **Prisma 7.x** com `@prisma/adapter-pg` (driver adapter, não o cliente clássico)
- **PostgreSQL** — ligação via `PrismaPg` em `lib/db.ts`
- **next-intl 4.x** para i18n (pt/en), configurado em `i18n.ts` e `next.config.ts`
- **Tailwind CSS 4**, **Framer Motion**, **Gemini AI** (`@google/generative-ai`)

## Base de Dados

A base de dados é PostgreSQL externa. O `DATABASE_URL` deve incluir parâmetros SSL para ambientes de produção.

`lib/db.ts` adiciona automaticamente `?uselibpqcompat=true&sslmode=require` em produção se não estiver presente na URL.

**Importante — Render free tier PostgreSQL expira ao fim de 90 dias.** Usar preferencialmente **Neon** (neon.tech) ou **Supabase** (supabase.com) que são gratuitos sem expiração. Após criar uma nova base de dados, atualizar `DATABASE_URL` no Render e correr as migrações.

### Base de dados atual: Supabase (Frankfurt)
- **Transaction pooler** (porta 6543) — usar no Render e em produção
- **Direct connection** (porta 5432, host `db.demdxsnroqwiyarhralj.supabase.co`) — usar apenas para correr migrações

Para correr migrações contra o Supabase:
```powershell
$env:DATABASE_URL="postgresql://postgres:PASSWORD@db.demdxsnroqwiyarhralj.supabase.co:5432/postgres"; npx prisma migrate deploy
```

Após qualquer alteração ao schema:
```bash
npx prisma migrate dev      # desenvolvimento (cria nova migração)
npx prisma migrate deploy   # produção (aplica migrações existentes)
```

**Data API desactivada** (2026-06-24) — o endpoint `/rest/v1/` está desligado nas definições do Supabase (Integrations → Data API → toggle OFF). A app não usa esta API (liga via Prisma directamente ao PostgreSQL), por isso não há impacto funcional. Esta acção resolveu dois alertas críticos de segurança do Supabase: `rls_disabled_in_public` e `sensitive_columns_exposed`. Não reactivar — a segurança é gerida pela app (next-auth + Prisma), não por RLS.

## Deployment (Render)

Variáveis de ambiente obrigatórias no Render:
- `DATABASE_URL` — connection string PostgreSQL com SSL
- `AUTH_SECRET` — secret do next-auth v5
- `AUTH_URL` — URL pública da app (ex: `https://outofbox.onrender.com`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth Google
- `GEMINI_API_KEY`
- `CRON_SECRET` — usado pelo GitHub Actions para autenticar o endpoint `/api/weekly-summary`

Build command: `npm install && npx prisma generate && npm run build`

## Compliance — EU AI Act Art. 50

`components/chat/ChatWindow.tsx` mostra um banner dismissível (uma vez por sessão de browser, via `sessionStorage`) a avisar que o conteúdo é gerado por IA. Não remover sem substituir por outro mecanismo de disclosure equivalente.

## Autenticação

Configurada em `lib/auth.ts` com `PrismaAdapter` (sessões em base de dados, não JWT).
O Google OAuth requer que `https://<domínio>/api/auth/callback/google` esteja nas redirect URIs autorizadas na Google Cloud Console.

## GitHub Actions

`.github/workflows/weekly-summary.yml` — corre às **segundas e quintas às 8h UTC**, chama `POST /api/weekly-summary`. Reativar manualmente se desativado por inatividade (após 60 dias sem commits).

**Dupla função:** além de gerar o resumo semanal, este workflow é o que mantém o Supabase activo — faz queries à DB duas vezes por semana, evitando que o projecto seja pausado por inactividade (free tier pausa após 7 dias sem queries). Confirmado a funcionar: resposta `{"ok":true,"processed":0}` em ~44s (inclui wake-up do Render free tier). Se o Supabase enviar email de aviso de pausa, verificar primeiro se o workflow está activo e se o último run teve sucesso.

**Dupla função:** além de gerar o resumo semanal, este workflow é o que mantém o Supabase activo — faz queries à DB semanalmente, evitando que o projecto seja pausado por inactividade (free tier pausa após 7 dias sem queries). Confirmado a funcionar: resposta `{"ok":true,"processed":0}` em ~44s (inclui wake-up do Render free tier). Se o Supabase enviar email de aviso de pausa, verificar primeiro se o workflow está activo e se o último run teve sucesso.

## graphify — Knowledge Graph

Este projeto tem um knowledge graph em `graphify-out/`.

**Instalação (uma vez):** `pip install graphifyy`
**Gerar grafo:** `graphify .` (correr na raiz do projeto)
**Atualizar após alterações:** `graphify update .`

Regras de uso:
- Para perguntas sobre o codebase, correr primeiro `graphify query "<pergunta>"` se `graphify-out/graph.json` existir
- Para relações entre ficheiros/módulos: `graphify path "<A>" "<B>"`
- Para explicar um conceito: `graphify explain "<conceito>"`
- Ler `graphify-out/GRAPH_REPORT.md` apenas para revisão de arquitectura geral
## /last30days — Pesquisa de Mercado e Insights

Usar `/last30days` antes de desenvolver novas features ou tomar decisões de produto.

**Next.js e stack técnica:**
```
/last30days Next.js 15 performance issues reddit
/last30days next-auth v5 problems complaints 2025
/last30days Prisma PostgreSQL production issues feedback
/last30days Tailwind CSS 4 migration problems
```

**Produto e UX:**
```
/last30days SaaS onboarding UX best practices reddit 2025
/last30days multilingual app i18n user experience feedback
/last30days subscription SaaS pricing complaints users
/last30days Framer Motion performance issues reddit
```

**Mercado:**
```
/last30days SaaS competitor analysis tools reddit
/last30days B2B SaaS user retention problems feedback
/last30days Neon Supabase database comparison reddit
```
