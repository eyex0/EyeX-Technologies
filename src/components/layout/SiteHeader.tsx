import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BrandMark } from "./BrandMark";

const NAV = [
  { to: "/", label: "Platform" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/ai-chat", label: "AI Chat" },
  { to: "/documents", label: "Documents" },
  { to: "/api", label: "API" },
  { to: "/analytics", label: "Analytics" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-16 flex items-center justify-center px-6">
      <div className="max-w-[1200px] w-full flex items-center justify-between">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[10px] font-medium uppercase tracking-widest">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-eye-text hover:text-eye-white transition-colors"
              activeProps={{ className: "text-eye-white" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden md:inline-flex text-[10px] font-medium uppercase tracking-widest text-eye-text hover:text-eye-white transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="luminous-btn-primary px-5 py-2 text-[10px] font-bold uppercase tracking-widest hidden sm:inline-flex"
          >
            Sign Up
          </Link>
          <button
            aria-label="Toggle menu"
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 border border-eye-border text-eye-white"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute top-16 left-0 right-0 lg:hidden bg-eye-bg border-b border-eye-border">
          <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-eye-text hover:text-eye-white transition-colors text-sm uppercase tracking-widest font-medium"
                activeProps={{ className: "text-eye-white" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-eye-text hover:text-eye-white transition-colors text-sm uppercase tracking-widest font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="luminous-btn-primary h-11 px-5 mt-2 text-[10px] font-bold uppercase tracking-widest self-start text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
