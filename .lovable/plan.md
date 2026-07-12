
# EyeX Technologies — Sito basato sul design "Pro"

## Obiettivo
Trasformare il set di design `*_eyex_technologies_pro` dello zip in un sito TanStack Start funzionante, con il logo caricato (icona nero+intreccio bianco) accompagnato dal wordmark **EyeX Technologies** nell'header globale.

## Sistema di design (da `home_eyex_technologies_pro/code.html`)
- Tema **dark** enterprise, minimalista.
- Palette: `--background #050505`, `--surface #0A0A0C`, `--border #1A1A1C`, `--muted #A1A1AA`, `--foreground #FAFAFA`, `--primary #38BDF8`.
- Font: **Geist** (display + body), **Geist Mono** (mono). Caricati via `<link>` in `__root.tsx`.
- Radius stretti (0.125rem base), bordi sottili, card "bento", pulsanti "luminous" (primary bianco su nero, secondary outline).
- Micro-animazioni fade-up già presenti nell'HTML → riprodotte con classi Tailwind + `IntersectionObserver` in un hook.

I token vengono portati in `src/styles.css` (`:root` e `.dark`) sostituendo il tema chiaro di default. La classe `dark` viene aggiunta a `<html>` in `__root.tsx`.

## Logo e brand
- L'immagine caricata `user-uploads://screen.png` viene caricata come asset CDN via `lovable-assets create` → `src/assets/eyex-logo.png.asset.json`.
- Diventa anche la favicon (`public/favicon.png` + link in `__root.tsx`, e rimozione del `favicon.ico` di default).
- Componente `<BrandMark />` = icona 28px + wordmark "EyeX **Technologies**" (Geist, tracking stretto, "Technologies" in muted).

## Header globale
Un unico `<SiteHeader />` renderizzato in `__root.tsx` sopra `<Outlet />`, sticky, `glass-nav` (bg `rgba(5,5,5,0.9)` + border-bottom). Contenuto:
- `<BrandMark />` a sinistra (link a `/`).
- Nav centrale: Platform (`/`), Dashboard, AI Chat, Documents, API, Analytics, About.
- CTA a destra: "Sign in" (secondary) + "Request access" (primary).
- Versione mobile: menu hamburger con Sheet shadcn.

## Routing (7 pagine dal set Pro)
```
src/routes/
  __root.tsx                 # shell + SiteHeader + Footer
  index.tsx                  # home_eyex_technologies_pro
  dashboard.tsx              # dashboard_eyex_technologies_pro
  ai-chat.tsx                # ai_chat_eyex_technologies_pro
  documents.tsx              # documents_eyex_technologies_pro
  api.tsx                    # api_platform_eyex_technologies_pro
  analytics.tsx              # analytics_eyex_technologies_pro
  about.tsx                  # about_eyex_technologies_pro_origin_story
```
Ogni route ha il proprio `head()` con `title`, `description`, `og:title`, `og:description` specifici (niente riuso della home).

## Portaggio HTML → React
Per ciascuna delle 7 pagine:
1. Prendo `code.html` dallo zip come riferimento strutturale (composizione, ordine sezioni, conteggio card, copy).
2. Estraggo il `<body>` (rimuovendo `<nav>` interno perché sostituito dall'header globale) in un componente pagina React.
3. Sostituisco `<span class="material-symbols-outlined">nome</span>` con le icone equivalenti di `lucide-react`.
4. Immagini remote / placeholder → `generate_image` in `src/assets/` quando servono (hero home, ritratti team about). Per illustrazioni astratte già in HTML/SVG mantengo l'inline SVG.
5. Le classi Tailwind restano invariate; le utility custom (`bento-card`, `glass-nav`, `luminous-btn-*`, `fade-up`) migrano in `src/styles.css` con `@utility` o classi normali.

## Dettagli tecnici
- **Nessun backend / Cloud**: sito statico marketing + dashboard demo con dati fittizi hard-coded.
- **Metadata `__root.tsx`**: title `"EyeX Technologies — Intelligence, Architected"`, description reale, og/twitter coerenti; nessun `og:image` sul root (aggiunto solo su leaf se serve).
- **Font**: `<link>` a `fonts.googleapis.com` + `cdn.jsdelivr.net/npm/geist` in `head().links` di `__root.tsx`.
- **Fade-up on scroll**: hook `useFadeUp` con `IntersectionObserver` applicato tramite `data-fade-up`.

## Non incluso (posso aggiungerlo dopo)
- Le altre varianti di design (`minimalist_authority`, `enterprise_refinement`, `brand_integration`, `qorx_*`, `synthetic_intelligence_interface`).
- Auth / area riservata reale (i pulsanti "Sign in" sono placeholder).
- CMS o contenuti dinamici.
