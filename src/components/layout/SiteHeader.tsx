import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { motion, AnimatePresence } from "framer-motion";

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
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-16 flex items-center justify-center px-6 border-b border-white/[0.04]">
      <div className="max-w-[1200px] w-full flex items-center justify-between">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onMouseEnter={() => setHoveredTab(item.to)}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative text-eye-text hover:text-eye-white transition-colors px-3 py-1.5 rounded-md"
              activeProps={{ className: "text-eye-white" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              <span className="relative z-10">{item.label}</span>
              {hoveredTab === item.to && (
                <motion.div
                  layoutId="navHover"
                  className="absolute inset-0 bg-white/[0.03] border border-white/[0.05] rounded-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            className="hidden md:inline-flex text-[10px] font-medium uppercase tracking-widest text-eye-text hover:text-eye-white transition-colors cursor-pointer"
            onClick={() => navigate({ to: "/auth" })}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate({ to: "/auth" })}
            className="luminous-btn-primary px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hidden sm:inline-flex cursor-pointer"
          >
            Request Access
          </button>
          <button
            aria-label="Toggle menu"
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 border border-white/[0.08] rounded-md text-eye-white hover:bg-white/[0.02]"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-16 left-0 right-0 lg:hidden bg-eye-bg border-b border-white/[0.06] backdrop-blur-xl"
          >
            <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-4">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="text-eye-text hover:text-eye-white transition-colors text-xs uppercase tracking-widest font-medium py-1"
                  activeProps={{ className: "text-eye-white" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/auth" });
                }}
                className="luminous-btn-primary h-11 px-5 mt-2 text-[10px] font-bold uppercase tracking-widest self-start w-full sm:w-auto"
              >
                Request Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
