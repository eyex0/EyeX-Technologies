import { Link } from "@tanstack/react-router";
import { BrandMark } from "./BrandMark";

const FOOTER_LINKS = [
  {
    label: "Platform",
    items: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/analytics", label: "Analytics" },
      { to: "/ai-chat", label: "AI Chat" },
      { to: "/api", label: "API" },
    ],
  },
  {
    label: "Resources",
    items: [
      { to: "/documents", label: "Documents" },
      { to: "/about", label: "About" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-eye-border bg-eye-bg">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <BrandMark />
            <p className="mt-4 text-xs text-eye-text font-light leading-relaxed max-w-xs">
              The foundational intelligence infrastructure for the next generation of global enterprise.
            </p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <div key={group.label}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-eye-white mb-4">
                {group.label}
              </h4>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-xs text-eye-text hover:text-eye-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-eye-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-eye-text font-mono">
            &copy; {new Date().getFullYear()} EyeX Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-eye-text font-mono hover:text-eye-white cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="text-[10px] text-eye-text font-mono hover:text-eye-white cursor-pointer transition-colors">
              Terms
            </span>
            <span className="text-[10px] text-eye-text font-mono hover:text-eye-white cursor-pointer transition-colors">
              Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
