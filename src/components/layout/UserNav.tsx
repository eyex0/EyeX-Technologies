import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import {
  User,
  Settings,
  Bell,
  Key,
  CreditCard,
  LifeBuoy,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

export function UserNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const userEmail = user.email || "";
  const userName = user.user_metadata?.full_name || userEmail.split("@")[0] || "User";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate({ to: "/" });
  };

  const menuGroups = [
    [
      { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
      { icon: User, label: "Profile", to: "/profile" },
      { icon: Settings, label: "Settings", to: "/settings" },
    ],
    [
      { icon: Bell, label: "Notifications", to: "/notifications" },
      { icon: Key, label: "API Keys", to: "/api-keys" },
      { icon: CreditCard, label: "Billing", to: "/billing" },
    ],
    [{ icon: LifeBuoy, label: "Support", to: "/support" }],
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 pr-2.5 rounded-full border border-white/[0.05] hover:bg-white/[0.03] transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500/50"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={userName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest">
              {initials}
            </span>
          )}
        </div>
        <div className="hidden md:flex flex-col items-start max-w-[120px]">
          <span className="text-[11px] font-medium text-eye-white truncate w-full">
            {userName}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 top-[calc(100%+8px)] w-60 rounded-xl bg-[#08080A]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden z-50"
            style={{
              boxShadow:
                "0 20px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset",
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.01]">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-eye-white truncate">{userName}</span>
                <span className="text-[11px] text-muted-foreground truncate">{userEmail}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuGroups.map((group, groupIdx) => (
                <div
                  key={groupIdx}
                  className={groupIdx > 0 ? "border-t border-white/[0.04] mt-1 pt-1" : ""}
                >
                  {group.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-[13px] text-muted-foreground hover:text-eye-white hover:bg-white/[0.04] transition-colors"
                    >
                      <item.icon size={15} className="text-muted-foreground/70" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.05] p-2 bg-black/20">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-3 py-2 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
