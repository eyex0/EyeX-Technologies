# EyeX Technologies — Changelog

## 2026-07-19

### Feature: Full MVP Wiring
- **Changed:** Wired all 16 remaining pages to real Supabase data
- **Changed:** CRM, Sales, Finance, HR, Projects, Inventory pages now use useQuery + real data services
- **Changed:** Notifications page wired to Supabase with mark-as-read
- **Changed:** Settings page has real profile management, password change, account deletion
- **Changed:** Documents, DataSources, Reports pages wired to Supabase queries
- **Changed:** AiCopilot wired to chatWithCopilotFn Gemini backend
- **Changed:** API page has full key management (generate, revoke, delete) with localStorage
- **Changed:** Integrations page has static catalog with connect/disconnect toggles
- **Changed:** Marketing page shows CTA to connect data source
- **Files modified:** 15 files (+2113, -759 lines)
- **Tests:** All 24 pages verified HTTP 200
- **Result:** All pages use real data with loading/empty states

### Feature: Complete Product Infrastructure
- **Changed:** Login, Signup, Forgot Password pages with Supabase auth
- **Changed:** AuthProvider with session management
- **Changed:** ProtectedRoute wrapper on all 18 app routes
- **Changed:** Server-side Supabase client for SSR
- **Changed:** Contact page with form (react-hook-form + zod)
- **Changed:** 404 NotFound page
- **Changed:** SEO meta tags on all 25 routes
- **Changed:** Full TypeScript types for 26-table schema
- **Changed:** 8 domain data services (Finance, CRM, Sales, HR, Projects, Inventory, Documents, Notifications)
- **Changed:** SiteHeader Login/Sign Up links, SiteFooter Contact link
- **Files modified:** 52 files (+4601, -654 lines)
- **Tests:** All 24 pages verified HTTP 200
- **Result:** Complete auth flow, real data layer, production-ready infrastructure

### Feature: Accessibility and Type Safety
- **Changed:** Added aria-labels to 17+ icon-only buttons
- **Changed:** Replaced 11 `(r: any)` with proper typeof types
- **Changed:** Fixed catch (err: any) to catch (err: unknown)
- **Changed:** Fixed sitemap URL to production domain
- **Changed:** Removed unused imports from Home.tsx
- **Files modified:** 14 files (+30, -34 lines)
- **Tests:** Build clean, deployed
- **Result:** Improved accessibility and type safety

### Fix: Audit Cleanup
- **Changed:** Added /ai-chat and /api to APP_ROUTES
- **Changed:** Removed duplicate nav/footer from Home.tsx and About.tsx
- **Changed:** Fixed AiCopilot invisible text (text-surface-container-high → text-primary-brand)
- **Changed:** Expanded ICONS map in primitives.tsx (16 new icon mappings)
- **Changed:** Removed 4 dead files (use-auth, use-fade-up, storage.service, auth.service)
- **Files modified:** 14 files (+16, -475 lines)
- **Tests:** Build clean, deployed
- **Result:** Fixed duplicate UI, missing icons, dead code

## 2026-07-18

### Feature: Stitch Integration and SSR
- **Changed:** Generated 7 Stitch screens (Home, About, AiChat, AiCopilot, Api, Dashboard, Analytics)
- **Changed:** Converted Stitch HTML to React TSX with lucide-react icons
- **Changed:** Fixed SSR routing for Cloudflare Workers
- **Changed:** Applied SSR patch to index.mjs
- **Files modified:** 20+ files
- **Tests:** SSR working on Cloudflare
- **Result:** Stitch-generated pages integrated with SSR

### Feature: Pro Design System
- **Changed:** Dark theme (#050505 bg, #38BDF8 primary, Geist fonts)
- **Changed:** Custom CSS utilities (bento-card, glass-nav, luminous-btn, fade-up, ambient-glow)
- **Changed:** MD3 color tokens (surface, on-surface, outline, etc.)
- **Changed:** BrandMark with lucide-react Eye icon
- **Files modified:** 10+ files
- **Tests:** Visual verification
- **Result:** Consistent dark enterprise design

### Feature: Initial Setup
- **Changed:** Merged eyex_tech codebase (src/, configs, package.json)
- **Changed:** Custom AI agent framework (8 agents + orchestrator)
- **Changed:** Replaced Material Symbols with lucide-react
- **Changed:** Cloudflare Workers deployment
- **Files modified:** 50+ files
- **Tests:** Build clean, deploy working
- **Result:** Foundation for the complete product
