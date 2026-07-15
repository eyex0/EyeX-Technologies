import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "./UserNav";

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
  const { user, isLoading } = useAuth();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass-nav h-16 flex items-center justify-center px-6"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated top border highlight */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.5) 30%, rgba(167,139,250,0.3) 70%, transparent 100%)",
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-[1200px] w-full flex items-center justify-between gap-6">
        <Link to="/" className="shrink-0 flex items-center" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest">
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
                  className="absolute inset-0 rounded-md"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(56,189,248,0.05) 0%, rgba(255,255,255,0.03) 100%)",
                    border: "1px solid rgba(56,189,248,0.12)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {!isLoading && user ? (
            <>
              <motion.button
                onClick={() => navigate({ to: "/dashboard" })}
                className="hidden md:inline-flex text-[10px] font-medium uppercase tracking-widest text-eye-text hover:text-eye-white transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                Open Dashboard
              </motion.button>
              <UserNav />
            </>
          ) : (
            !isLoading && (
              <>
                <motion.button
                  className="hidden md:inline-flex text-[10px] font-medium uppercase tracking-widest text-eye-text hover:text-eye-white transition-colors cursor-pointer"
                  onClick={() => navigate({ to: "/auth" })}
                  whileHover={{ scale: 1.02 }}
                >
                  Sign in
                </motion.button>

                <motion.button
                  onClick={() => navigate({ to: "/auth" })}
                  className="luminous-btn-primary px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hidden sm:inline-flex cursor-pointer"
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Request Access
                </motion.button>
              </>
            )
          )}

          <button
            aria-label="Toggle menu"
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 border border-white/[0.08] rounded-md text-eye-white hover:bg-white/[0.02]"
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, height: "auto", backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, height: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-16 left-0 right-0 lg:hidden bg-eye-bg/90 border-b border-white/[0.06] overflow-hidden"
          >
            <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col gap-3">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="text-eye-text hover:text-eye-white transition-colors text-xs uppercase tracking-widest font-medium py-1 block"
                    activeProps={{ className: "text-eye-white" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {!isLoading && user ? (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: NAV.length * 0.05 + 0.05 }}
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/dashboard" });
                  }}
                  className="luminous-btn-primary h-11 px-5 mt-2 text-[10px] font-bold uppercase tracking-widest self-start w-full sm:w-auto"
                >
                  Open Dashboard
                </motion.button>
              ) : (
                !isLoading && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: NAV.length * 0.05 + 0.05 }}
                    onClick={() => {
                      setOpen(false);
                      navigate({ to: "/auth" });
                    }}
                    className="luminous-btn-primary h-11 px-5 mt-2 text-[10px] font-bold uppercase tracking-widest self-start w-full sm:w-auto"
                  >
                    Request Access
                  </motion.button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
