import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

type NavItem = { to: string; label: string; icon: string };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
      { to: "/analytics", label: "Analytics", icon: "bar_chart" },
      { to: "/data-sources", label: "Data Sources", icon: "database" },
      { to: "/ai-copilot", label: "AI Copilot", icon: "auto_awesome" },
      { to: "/reports", label: "Reports", icon: "description" },
    ],
  },
  {
    label: "Business",
    items: [
      { to: "/crm", label: "CRM", icon: "groups" },
      { to: "/sales", label: "Sales", icon: "shopping_bag" },
      { to: "/marketing", label: "Marketing", icon: "campaign" },
      { to: "/finance", label: "Finance", icon: "account_balance" },
      { to: "/inventory", label: "Inventory", icon: "inventory_2" },
      { to: "/hr", label: "HR", icon: "badge" },
      { to: "/projects", label: "Projects", icon: "assignment" },
      { to: "/documents", label: "Documents", icon: "folder" },
    ],
  },
  {
    label: "Platform",
    items: [
      { to: "/integrations", label: "Integrations", icon: "extension" },
      { to: "/notifications", label: "Notifications", icon: "notifications" },
      { to: "/settings", label: "Settings", icon: "settings" },
    ],
  },
];

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "?";

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const displaySub = user?.email ?? "";

  return (
    <div className="fixed inset-0 top-0 bg-background flex overflow-hidden">
      {/* Sidebar */}
      <nav
        className={`${
          mobileOpen ? "flex" : "hidden"
        } md:flex w-[240px] flex-shrink-0 border-r border-border bg-background flex-col h-full py-6 absolute md:relative z-40 inset-y-0 left-0`}
      >
        <div className="px-6 mb-8 flex items-center gap-2 relative">
          {/* Scan line across logo bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent)" }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="h-7 w-7 flex items-center justify-center rounded-sm overflow-hidden relative">
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-sm"
              animate={{ boxShadow: ["0 0 0px rgba(56,189,248,0)", "0 0 8px rgba(56,189,248,0.4)", "0 0 0px rgba(56,189,248,0)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <img src="/Logo.png" alt="EyeX Logo" className="h-full w-full object-cover relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-xs tracking-tight text-white leading-none">
              EyeX Technologies
            </span>
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider leading-none mt-1">
              QORX OS
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-2 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.to || pathname.startsWith(item.to + "/");
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors ${
                        active ? "text-white" : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      {active && (
                      <motion.div
                        layoutId="sidebarActive"
                        className="absolute inset-0 rounded-md"
                        style={{
                          background: "linear-gradient(90deg, rgba(56,189,248,0.06) 0%, rgba(56,189,248,0.01) 100%)",
                          borderLeft: "2px solid rgba(56,189,248,0.7)",
                          boxShadow: "inset 0 0 20px rgba(56,189,248,0.03)",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                      )}
                      <span
                        className="material-symbols-outlined text-[18px] relative z-10"
                        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {item.icon}
                      </span>
                      <span className="font-medium relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-3 mt-4">
          <div className="flex items-center gap-3 p-3 border-t border-border">
            <div className="w-8 h-8 rounded-sm bg-secondary flex items-center justify-center border border-border flex-shrink-0">
              <span className="text-[10px] font-mono font-bold text-white">{initials}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-xs text-white truncate">{displayName}</span>
              <span className="text-muted-foreground text-[10px] font-mono truncate">{displaySub}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        <header className="flex-shrink-0 border-b border-border px-6 md:px-8 py-4 md:py-5 flex items-center justify-between bg-background z-10">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle sidebar"
              className="md:hidden w-9 h-9 border border-border rounded-md flex items-center justify-center text-muted-foreground"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="material-symbols-outlined text-[18px]">menu</span>
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground mt-0.5 font-mono text-[10px] uppercase tracking-wider">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions ?? (
              <>
                <button className="bento-card w-9 h-9 hidden sm:flex items-center justify-center rounded-md text-muted-foreground hover:text-white">
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
                <button className="bg-white hover:bg-white/90 text-black px-4 h-9 rounded-md font-semibold text-xs flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-[16px] font-bold">add</span>
                  New
                </button>
              </>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
