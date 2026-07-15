import { motion } from "framer-motion";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo with layered animated rings */}
      <div className="relative flex items-center justify-center w-10 h-10">
        {/* Outer rotating dashed ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid transparent",
            backgroundImage:
              "linear-gradient(#050505, #050505), conic-gradient(from 0deg, rgba(56,189,248,0.4), transparent 60%, rgba(56,189,248,0.4))",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner pulse glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-sky-500/5"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Logo image */}
        <img
          src="/Logo.png"
          alt="EyeX Technologies Logo"
          className="h-7 w-7 object-contain relative z-10 rounded-sm"
        />
      </div>

      {/* Brand text */}
      <div className="flex flex-col">
        <motion.span
          className="font-display font-medium text-[14px] leading-tight text-white tracking-tight"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          EyeX Technologies
        </motion.span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
          QORX · AI Business OS
        </span>
      </div>
    </div>
  );
}
