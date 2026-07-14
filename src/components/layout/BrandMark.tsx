import { motion } from "framer-motion";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Animated outer glowing ring */}
        <motion.div
          className="absolute -inset-1.5 rounded-full border border-sky-500/20 blur-[2px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <img
          src="/favicon.png"
          alt="EyeX Technologies Logo"
          className="h-9 w-9 object-contain relative z-10"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-display font-medium text-[14px] leading-tight text-white tracking-tight">
          EyeX Technologies
        </span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
          QORX · AI Business OS
        </span>
      </div>
    </div>
  );
}
