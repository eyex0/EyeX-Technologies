import { motion } from "framer-motion";

/**
 * Ambient floating orbs that drift slowly across the background
 * with smooth gradients and blur — Antigravity-style light accents.
 */
export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary cyan orb — top right */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
          top: "-5%",
          right: "-10%",
        }}
        animate={{
          x: [0, -40, 20, -10, 0],
          y: [0, 30, -20, 40, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Purple accent orb — bottom left */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.02) 40%, transparent 70%)",
          filter: "blur(80px)",
          bottom: "5%",
          left: "-5%",
        }}
        animate={{
          x: [0, 30, -20, 10, 0],
          y: [0, -40, 20, -30, 0],
          scale: [1, 0.95, 1.1, 1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Small intense accent — center */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 60%)",
          filter: "blur(40px)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          opacity: [0.3, 0.7, 0.4, 0.8, 0.3],
          scale: [0.8, 1.2, 0.9, 1.1, 0.8],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
