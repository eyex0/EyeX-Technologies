# Cloudflare Deployment Guide — QORX AI Business OS

This guide outlines how to deploy the QORX AI Business OS platform to **Cloudflare Pages / Workers** using the optimized Nitro build output.

---

## 1. Prerequisites

Before deploying, ensure you have:

- A Cloudflare Account.
- [Node.js](https://nodejs.org/) installed (v20+ recommended).
- The Supabase project keys and Google/Gemini API credentials.

---

## 2. Environment Variables Configuration

You must configure the following Environment Variables in your Cloudflare Pages/Workers Dashboard under **Settings ➜ Variables**:

| Variable Name               | Description                             | Value Example                      |
| :-------------------------- | :-------------------------------------- | :--------------------------------- |
| `VITE_SUPABASE_URL`         | Supabase API Endpoint                   | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY`    | Supabase Anon Key                       | `eyJh...`                          |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Server-only) | `eyJh...`                          |
| `GEMINI_API_KEY`            | Google Gemini API Key                   | `AIzaSy...`                        |

> [!IMPORTANT]
> Make sure `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are encrypted/secrets in your Cloudflare dashboard settings to ensure they are hidden from public client scripts.

---

## 3. Option A: Deployment via Wrangler CLI (Local Build)

To deploy the production-ready local build directly from your command line:

1. **Build the application**:

   ```bash
   npm run build
   ```

   _This generates the `.output` directory containing static public assets (`.output/public`) and the Nitro worker server (`.output/server`)._

2. **Login to Cloudflare**:

   ```bash
   npx wrangler login
   ```

3. **Deploy using the Wrangler prebuilt assets configuration**:
   ```bash
   npx wrangler deploy .output/server/index.mjs --assets .output/public
   ```
   _This uploads both the compiled Worker handler and static assets directly to your Cloudflare network._

---

## 4. Option B: Automated GitHub CI/CD Deployment

To configure Cloudflare Pages to build and deploy automatically from your GitHub repository:

1. Go to your **Cloudflare Dashboard ➜ Pages ➜ Create a Project ➜ Connect to Git**.
2. Select your repository.
3. Configure the **Build Settings**:
   - **Framework Preset**: `None`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `.output/public`
4. Under **Settings ➜ General ➜ Compatibility Flags**:
   - Add compatibility flag: `nodejs_compat` (This is required by Nitro and TanStack Start server functions).
5. Add your environment variables in **Settings ➜ Variables ➜ Environment Variables**.
6. Save and deploy!
