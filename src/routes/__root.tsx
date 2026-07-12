import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-eye-bg px-4 pt-16">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-medium text-eye-white tracking-tight">404</h1>
        <h2 className="mt-4 text-xl font-medium text-eye-white">Page not found</h2>
        <p className="mt-2 text-sm text-eye-text font-light">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="luminous-btn-primary px-6 py-3 text-[10px] font-bold uppercase tracking-widest"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-eye-bg px-4 pt-16">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display font-medium text-eye-white tracking-tight">
          Something failed to load
        </h1>
        <p className="mt-2 text-sm text-eye-text font-light">
          A rare fault. Try refreshing, or return to the platform overview.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="luminous-btn-primary px-6 py-3 text-[10px] font-bold uppercase tracking-widest"
          >
            Try again
          </button>
          <a
            href="/"
            className="luminous-btn-secondary px-6 py-3 text-[10px] font-bold uppercase tracking-widest"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EyeX Technologies — Intelligence, Architected" },
      {
        name: "description",
        content:
          "EyeX Technologies is the foundational intelligence infrastructure for the next generation of global enterprise — secured by design, engineered for scale.",
      },
      { name: "author", content: "EyeX Technologies" },
      { name: "theme-color", content: "#050505" },
      { property: "og:title", content: "EyeX Technologies — Intelligence, Architected" },
      {
        property: "og:description",
        content:
          "EyeX Technologies is the foundational intelligence infrastructure for the next generation of global enterprise — secured by design, engineered for scale.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "EyeX Technologies — Intelligence, Architected" },
      {
        name: "twitter:description",
        content:
          "EyeX Technologies is the foundational intelligence infrastructure for the next generation of global enterprise — secured by design, engineered for scale.",
      },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cacd0493-9fe7-412e-aa53-ed2acdc6d564/id-preview-f857cd7d--16c4b0a7-64a1-4989-9f1c-e58f35d43b4e.lovable.app-1783779327374.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cacd0493-9fe7-412e-aa53-ed2acdc6d564/id-preview-f857cd7d--16c4b0a7-64a1-4989-9f1c-e58f35d43b4e.lovable.app-1783779327374.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400..600&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const APP_ROUTES = [
  "/dashboard","/analytics","/data-sources","/ai-copilot","/reports",
  "/crm","/sales","/marketing","/finance","/inventory","/hr","/projects",
  "/documents","/integrations","/notifications","/settings",
];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterLocation();
  const isApp = APP_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-eye-bg text-eye-text">
        {!isApp && <SiteHeader />}
        <main className={isApp ? "" : "pt-16"}>
          <Outlet />
        </main>
        {!isApp && <SiteFooter />}
      </div>
    </QueryClientProvider>
  );
}

function useRouterLocation() {
  const router = useRouter();
  return router.state.location.pathname;
}
