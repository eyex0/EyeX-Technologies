import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ParticleField } from "@/components/effects/ParticleField";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { GradientText } from "@/components/effects/GradientText";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 40, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 16,
    },
  },
};

const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="relative min-h-screen bg-eye-bg overflow-hidden">
      {/* === HERO SECTION === */}
      <header
        ref={heroRef}
        className="relative min-h-[100vh] w-full flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Animated background layers */}
        <div className="absolute inset-0">
          <ParticleField count={70} color="56, 189, 248" />
          <FloatingOrbs />
          <div className="absolute inset-0 ambient-grid pointer-events-none opacity-30" />
          <div className="absolute inset-0 bg-radial-mesh pointer-events-none" />
        </div>

        {/* Horizon glow line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.4) 50%, transparent 100%)",
          }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Hero content with parallax */}
        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Pill badge */}
          <motion.div
            variants={itemVariants}
            className="mb-8 px-4 py-2 rounded-full border border-sky-500/20 bg-sky-500/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sky-400 font-mono text-[10px] uppercase tracking-[0.25em] font-semibold">
                Introducing QORX AI Business OS
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl md:text-[5.5rem] lg:text-[6.5rem] font-display font-medium text-eye-white tracking-[-0.04em] leading-[1.02] mb-8"
          >
            Intelligence, <br />
            <GradientText
              from="#38BDF8"
              via="#A78BFA"
              to="#FAFAFA"
              duration={8}
              className="glow-text-cyber"
            >
              Architected.
            </GradientText>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-eye-text max-w-2xl mb-14 leading-relaxed font-light"
          >
            The foundational intelligence operating system for the next generation of global
            enterprise. Secured by design, engineered for scale, and optimized for high-stakes
            operational environments.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/dashboard"
                className="luminous-btn-primary h-[52px] px-10 font-bold text-[10px] uppercase tracking-widest w-full sm:w-auto"
              >
                Explore QORX
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/about"
                className="luminous-btn-secondary h-[52px] px-10 font-bold text-[10px] uppercase tracking-widest w-full sm:w-auto"
              >
                manifesto
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-20 flex flex-col items-center gap-2"
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-eye-text/50">
              scroll
            </span>
            <motion.div
              className="w-5 h-8 border border-white/10 rounded-full flex items-start justify-center p-1"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-2 bg-sky-400/60 rounded-full"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </header>

      {/* === CAPABILITIES SECTION === */}
      <section className="py-32 px-6 w-full flex justify-center border-t border-white/[0.04] bg-[#050507]/90 relative z-10">
        {/* Subtle particle layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ParticleField count={30} color="139, 92, 246" />
        </div>

        <div className="max-w-[1200px] w-full flex flex-col gap-20 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-xl">
              <motion.h2
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Foundation
              </motion.h2>
              <h3 className="text-3xl md:text-5xl font-display font-medium text-eye-white tracking-tight leading-none">
                Enterprise-Grade Intelligence
              </h3>
            </div>
            <p className="text-eye-text max-w-md font-light text-sm leading-relaxed">
              Robust architectural standards meet pioneering computational research to deliver
              predictable, high-performance outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Feature — Neural Architecture */}
            <motion.div
              className="bento-card md:col-span-2 md:row-span-2 flex flex-col rounded-xl"
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: [0, 1], y: [50, 0] }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-video w-full overflow-hidden border-b border-white/[0.04] bg-black/60 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050507]" />
                {/* Animated neural network visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border border-sky-500/10"
                      style={{
                        width: `${80 + i * 60}px`,
                        height: `${80 + i * 60}px`,
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.3, 0.1],
                        rotate: i % 2 === 0 ? [0, 360] : [360, 0],
                      }}
                      transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                  <motion.span
                    className="material-symbols-outlined text-[72px] font-extralight text-sky-400/20 relative z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    schema
                  </motion.span>
                </div>
              </div>
              <div className="p-10">
                <h4 className="text-xl font-medium text-eye-white mb-3 tracking-tight">
                  Proprietary Neural Architecture
                </h4>
                <p className="text-sm text-eye-text leading-relaxed font-light max-w-lg">
                  Our hardware-optimized models utilize specialized structural processing to
                  eliminate latency bottlenecks inherent in general-purpose cloud computing
                  architectures.
                </p>
              </div>
            </motion.div>

            {/* Security Card */}
            <motion.div
              className="bento-card p-10 flex flex-col justify-between rounded-xl min-h-[280px]"
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: [0, 1], y: [40, 0] }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex flex-col gap-6">
                <motion.span
                  className="material-symbols-outlined text-[28px] text-sky-400 bg-sky-500/10 p-3 rounded-lg self-start"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  shield_lock
                </motion.span>
                <div>
                  <h4 className="text-lg font-medium text-eye-white mb-3 tracking-tight">
                    Immutable Security
                  </h4>
                  <p className="text-xs text-eye-text font-light leading-relaxed">
                    Zero-trust architecture with hardware-level isolation. SOC2 Type II and HIPAA
                    compliant infrastructure for mission-critical data handling.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Scale Card */}
            <motion.div
              className="bento-card p-10 flex flex-col justify-between rounded-xl min-h-[280px]"
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: [0, 1], y: [40, 0] }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col gap-6">
                <motion.span
                  className="material-symbols-outlined text-[28px] text-sky-400 bg-sky-500/10 p-3 rounded-lg self-start"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  dynamic_form
                </motion.span>
                <div>
                  <h4 className="text-lg font-medium text-eye-white mb-3 tracking-tight">
                    Elastic Scalability
                  </h4>
                  <p className="text-xs text-eye-text font-light leading-relaxed">
                    Instantaneous resource allocation across global nodes, ensuring consistent
                    performance regardless of request volume or computational complexity.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Ecosystem Card */}
            <motion.div
              className="bento-card md:col-span-3 p-10 flex flex-col md:flex-row items-center gap-12 rounded-xl"
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              whileInView={{ opacity: [0, 1], y: [30, 0] }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex-1">
                <h4 className="text-2xl font-medium text-eye-white mb-4 tracking-tight">
                  Integrated QORX Ecosystem
                </h4>
                <p className="text-sm text-eye-text max-w-xl mb-8 font-light leading-relaxed">
                  From fine-tuning pipelines to real-time telemetry, our unified suite provides a
                  single point of orchestration for the entire intelligence lifecycle.
                </p>
                <Link
                  to="/dashboard"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-sky-400 transition-colors flex items-center gap-2 group"
                >
                  View Ecosystem{" "}
                  <motion.span
                    className="material-symbols-outlined text-[14px]"
                    whileHover={{ x: 4 }}
                  >
                    arrow_forward
                  </motion.span>
                </Link>
              </div>
              <div className="hidden md:block w-px h-24 bg-white/[0.06]" />
              <div className="w-full md:w-1/4 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-eye-text">
                  <span>SYSTEM LATENCY</span>
                  <motion.span
                    className="text-sky-400 font-bold"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    &lt;4ms
                  </motion.span>
                </div>
                <motion.div
                  className="w-full h-[1px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent)",
                  }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="flex justify-between items-center text-[10px] font-mono text-eye-text">
                  <span>AVAILABILITY</span>
                  <span className="text-white font-bold">99.999%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* === EXPERTISE SECTION === */}
      <section className="py-32 px-6 w-full flex justify-center bg-[#030304] border-t border-white/[0.04] relative z-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingOrbs />
        </div>

        <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Expertise
            </motion.h2>
            <h3 className="text-4xl md:text-5xl font-display font-medium text-eye-white tracking-tight leading-tight mb-8">
              Human insight,
              <br />
              <GradientText from="#A78BFA" via="#38BDF8" to="#FAFAFA" duration={6}>
                algorithmically amplified.
              </GradientText>
            </h3>
            <p className="text-eye-text text-base md:text-lg font-light leading-relaxed mb-10">
              Beyond the code, EyeX is built on the expertise of world-class engineers, designers,
              and industry veterans. We believe that true intelligence requires human perspective to
              remain grounded and ethical.
            </p>
            <motion.div
              className="flex items-start gap-4"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.span
                className="material-symbols-outlined text-sky-400 text-[24px] bg-sky-500/10 p-2.5 rounded-lg"
                whileHover={{ rotate: [0, -10, 10, 0] }}
              >
                verified_user
              </motion.span>
              <div>
                <h5 className="text-eye-white font-medium mb-1 text-sm">Principled Design</h5>
                <p className="text-xs text-eye-text font-light">
                  Every model is refined by subject matter experts to ensure real-world utility.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative aspect-[4/5] overflow-hidden border border-white/[0.04] bg-black/40 rounded-2xl flex items-center justify-center"
            initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#030304] to-transparent z-10" />

            {/* Animated concentric rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-sky-500/5"
                  style={{
                    width: `${120 + i * 80}px`,
                    height: `${120 + i * 80}px`,
                  }}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.05, 0.15, 0.05],
                  }}
                  transition={{
                    duration: 5 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 1,
                  }}
                />
              ))}
            </div>

            <motion.span
              className="material-symbols-outlined text-[100px] font-extralight text-sky-400/5 z-20"
              animate={{ rotate: [0, 3, 0, -3, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              group
            </motion.span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
