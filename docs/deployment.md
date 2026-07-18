# Deployment

## Cloudflare Pages (Recommended)

### Setup

1. Push to GitHub
2. Connect repository in Cloudflare Pages dashboard
3. Configure build settings:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Deploy command | `npx wrangler pages deploy dist` |
| Root directory | `/` |

4. Add environment variables in **Settings → Environment variables → Production**:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

### Custom Domain

1. Go to **Pages → your-project → Custom domains**
2. Add your domain
3. Update DNS records as instructed

## Docker Deployment

### Prerequisites

- Docker 24+
- Docker Compose v2+

### Build & Run

```bash
# Build all services
docker compose build

# Start services
docker compose up -d

# Check logs
docker compose logs -f
```

### Services

| Service | Port | Description |
|---|---|---|
| Frontend | 80 | Nginx-served static SPA |
| API | 3001 | API service |
| Redis | 6379 | Cache (optional) |

### Production

```bash
# Override with production config
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## GitHub Actions CI/CD

The repository includes two workflows:

### CI (`.github/workflows/ci.yml`)

Triggers on push/PR to `master`:
1. Checkout + setup Node 22
2. `npm ci`
3. `npm run build --workspaces` (all packages)
4. `npm run build` (frontend)
5. `npm test` (vitest)
6. Build + push Docker images to ghcr.io

### Deploy (`.github/workflows/deploy.yml`)

Triggers after CI succeeds on `master`:
1. Builds frontend
2. Deploys to Cloudflare Pages via wrangler-action

### Required Secrets

| Secret | Description |
|---|---|
| `CF_API_TOKEN` | Cloudflare API token with Pages write access |
| `GHCR_PAT` | GitHub PAT with packages:write (for Docker push) |

## Environment Variables

See [Environment.md](./environment.md) for the full list.
