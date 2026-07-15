import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleField } from "@/components/effects/ParticleField";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15,
    },
  },
};

const LOCKOUT_DURATION_S = 30;
const MAX_ATTEMPTS = 5;

function AuthPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  // UI state
  const [mode, setMode] = useState<"signIn" | "signUp" | "forgot">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Security: Brute-force rate limiting ───────────────────────────────────
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const isLockedOut = lockoutSeconds > 0;

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setTimeout(() => setLockoutSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [lockoutSeconds]);

  const registerFailedAttempt = () => {
    const next = failedAttempts + 1;
    setFailedAttempts(next);
    if (next >= MAX_ATTEMPTS) {
      setLockoutSeconds(LOCKOUT_DURATION_S);
      setFailedAttempts(0);
      setError(`Too many failed attempts. Please wait ${LOCKOUT_DURATION_S} seconds.`);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [authLoading, user, navigate]);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValidPassword = (p: string) => p.length >= 6;

  const handleSignIn = async () => {
    if (isLockedOut) return;
    setError(null);
    if (!isValidEmail(email) || !isValidPassword(password)) {
      setError("Please provide a valid email and password (min 6 characters).");
      return;
    }
    setLoading(true);
    try {
      await AuthService.signIn(email, password);
      setFailedAttempts(0);
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      registerFailedAttempt();
      if (!isLockedOut) setError(e.message ?? "Sign‑in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError(null);
    if (!isValidEmail(email) || !isValidPassword(password) || !fullName.trim()) {
      setError("All fields are required (password min 6 characters).");
      return;
    }
    setLoading(true);
    try {
      await AuthService.signUp(email, password, fullName.trim());
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      setError(e.message ?? "Sign‑up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setError(null);
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await AuthService.resetPassword(email);
      setError("Password‑reset email sent – check your inbox.");
      setMode("signIn");
    } catch (e: any) {
      setError(e.message ?? "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    setLoading(true);
    try {
      await AuthService.signInWithOAuth(provider);
    } catch (e: any) {
      setError(e.message ?? `${provider} login failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-eye-bg overflow-hidden p-6 bg-radial-mesh">
      {/* Particle background */}
      <ParticleField count={50} color="56, 189, 248" />

      {/* Background grid overlay */}
      <div className="absolute inset-0 ambient-grid pointer-events-none opacity-20" />

      {/* Animated Glow Orbs */}
      <motion.div
        className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", filter: "blur(80px)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10 bento-card rounded-2xl p-8 bg-eye-surface/90 border border-white/[0.05] shadow-2xl backdrop-blur-xl"
      >
        <div className="flex flex-col items-center mb-8">
          {/* Animated logo with pulsing rings */}
          <div className="relative h-16 w-16 flex items-center justify-center mb-5">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                border: "1px solid transparent",
                backgroundImage: "linear-gradient(#0A0A0C, #0A0A0C), conic-gradient(from 0deg, rgba(56,189,248,0.5), transparent 60%, rgba(167,139,250,0.3))",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner glow pulse */}
            <motion.div
              className="absolute inset-1 rounded-lg bg-sky-500/5"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <img src="/Logo.png" alt="EyeX Logo" className="h-9 w-9 object-contain relative z-10" />
          </div>
          <h1 className="text-2xl font-display font-medium text-white tracking-tight text-center">
            {mode === "signIn"
              ? "Welcome back"
              : mode === "signUp"
                ? "Create your account"
                : "Reset your password"}
          </h1>
          <p className="text-xs text-muted-foreground mt-2">QORX · AI Business Operating System</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-lg text-center mb-6 font-mono"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4 mb-6">
          {mode === "signUp" && (
            <div>
              <label className="block text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Sarah Chen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 bg-[#08080A]/60 border border-white/[0.05] text-white text-sm focus:outline-none focus:border-sky-500/40 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-white/20"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-[#08080A]/60 border border-white/[0.05] text-white text-sm focus:outline-none focus:border-sky-500/40 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-white/20"
            />
          </div>

          {mode !== "forgot" && (
            <div>
              <label className="block text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 bg-[#08080A]/60 border border-white/[0.05] text-white text-sm focus:outline-none focus:border-sky-500/40 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-white/20"
              />
            </div>
          )}
        </div>

        <motion.button
          whileHover={isLockedOut ? {} : { scale: 1.01 }}
          whileTap={isLockedOut ? {} : { scale: 0.99 }}
          onClick={
            mode === "signIn" ? handleSignIn : mode === "signUp" ? handleSignUp : handleForgot
          }
          disabled={loading || isLockedOut}
          className={`w-full luminous-btn-primary h-12 text-[10px] font-bold uppercase tracking-widest cursor-pointer disabled:opacity-50 ${
            isLockedOut
              ? "!bg-red-900/40 !border-red-500/30 !text-red-400 !shadow-none cursor-not-allowed"
              : ""
          }`}
        >
          {isLockedOut
            ? `Locked — wait ${lockoutSeconds}s`
            : loading
              ? "Processing…"
              : mode === "signIn"
                ? "Sign In"
                : mode === "signUp"
                  ? "Sign Up"
                  : "Send Reset Link"}
        </motion.button>

        {/* Mode Selector Links */}
        <div className="flex justify-between items-center mt-6 text-xs font-light">
          {mode === "signIn" ? (
            <>
              <button
                onClick={() => setMode("signUp")}
                className="text-muted-foreground hover:text-white transition-colors cursor-pointer"
              >
                Don't have an account? <span className="text-sky-400 font-normal">Sign Up</span>
              </button>
              <button
                onClick={() => setMode("forgot")}
                className="text-muted-foreground hover:text-white transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </>
          ) : mode === "signUp" ? (
            <button
              onClick={() => setMode("signIn")}
              className="text-muted-foreground hover:text-white transition-colors cursor-pointer w-full text-center"
            >
              Already have an account? <span className="text-sky-400 font-normal">Sign In</span>
            </button>
          ) : (
            <button
              onClick={() => setMode("signIn")}
              className="text-muted-foreground hover:text-white transition-colors cursor-pointer w-full text-center"
            >
              Back to <span className="text-sky-400 font-normal">Sign In</span>
            </button>
          )}
        </div>

        {/* Separator line */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.05]"></div>
          </div>
          <div className="relative flex justify-center text-[9px] font-mono uppercase tracking-widest">
            <span className="bg-eye-surface px-3 text-muted-foreground">or authenticate with</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ y: -1, backgroundColor: "rgba(255,255,255,0.03)" }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleOAuth("google")}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-white/[0.06] rounded-xl h-12 text-[10px] font-bold uppercase tracking-widest text-white cursor-pointer hover:border-white/10 disabled:opacity-50"
          >
            {/* Google Vector Icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Google
          </motion.button>

          <motion.button
            whileHover={{ y: -1, backgroundColor: "rgba(255,255,255,0.03)" }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleOAuth("github")}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-white/[0.06] rounded-xl h-12 text-[10px] font-bold uppercase tracking-widest text-white cursor-pointer hover:border-white/10 disabled:opacity-50"
          >
            {/* GitHub Vector Icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            GitHub
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
