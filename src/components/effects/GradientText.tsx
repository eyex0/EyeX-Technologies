import { motion } from "framer-motion";

/**
 * Animated gradient text component with a shimmering sweep effect.
 * Creates that premium "living text" effect seen in Antigravity.
 */
export function GradientText({
  children,
  className = "",
  from = "#38BDF8",
  via = "#A78BFA",
  to = "#FAFAFA",
  duration = 6,
}: {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  duration?: number;
}) {
  return (
    <motion.span
      className={`inline-block text-transparent bg-clip-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from}, ${via}, ${to}, ${via}, ${from})`,
        backgroundSize: "300% 100%",
      }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}
