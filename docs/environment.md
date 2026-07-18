# Environment Variables

## Required

| Variable | Description | Example |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIs...` |
| `OPENAI_API_KEY` | OpenAI API key for agents | `sk-...` |

## Optional

| Variable | Description | Default |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (admin operations) | — |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude agents | — |
| `STRIPE_SECRET_KEY` | Stripe secret key for billing | — |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | — |
| `RESEND_API_KEY` | Resend API key for email | — |
| `SLACK_BOT_TOKEN` | Slack bot token for alerts | — |
| `SLACK_SIGNING_SECRET` | Slack signing secret | — |
| `GITHUB_TOKEN` | GitHub token for GitOps | — |
| `REDIS_URL` | Redis connection string for caching | `redis://localhost:6379` |

## Frontend (Vite)

All frontend variables must be prefixed with `VITE_` to be accessible via `import.meta.env`.

## Local Development

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The `.env` file is gitignored. Never commit secrets.
