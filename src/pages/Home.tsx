import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 14,
    },
  },
};

export function HomePage() {
  return (
    <div className="relative min-h-screen bg-eye-bg overflow-hidden bg-radial-mesh">
      {/* Glow Orbs background */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute top-[60%] right-[5%] w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 ambient-grid pointer-events-none opacity-40" />

      {/* Hero Section */}
      <header className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-6 overflow-hidden pt-24">
        <motion.div
          className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 px-3 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-400 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold"
          >
            Introducing QORX AI Business OS
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl md:text-8xl font-display font-medium text-eye-white tracking-[-0.04em] leading-[1.02] mb-8"
          >
            Intelligence, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-white glow-text-cyber">
              Architected.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-eye-text max-w-2xl mb-12 leading-relaxed font-light"
          >
            The foundational intelligence operating system for the next generation of global
            enterprise. Secured by design, engineered for scale, and optimized for high-stakes
            operational environments.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <Link
              to="/dashboard"
              className="luminous-btn-primary h-[50px] px-10 font-bold text-[10px] uppercase tracking-widest w-full sm:w-auto"
            >
              Explore QORX
            </Link>
            <Link
              to="/about"
              className="luminous-btn-secondary h-[50px] px-10 font-bold text-[10px] uppercase tracking-widest w-full sm:w-auto"
            >
              manifesto
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* Capabilities Section */}
      <section className="py-32 px-6 w-full flex justify-center border-t border-white/[0.04] bg-[#050507]/90 relative z-10">
        <div className="max-w-[1200px] w-full flex flex-col gap-20">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-xl">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400 mb-4">
                Foundation
              </h2>
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
            {/* Main Feature */}
            <motion.div
              className="bento-card md:col-span-2 md:row-span-2 flex flex-col rounded-xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-video w-full overflow-hidden border-b border-white/[0.04] bg-black/60 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050507]" />
                <motion.span
                  className="material-symbols-outlined text-[72px] font-extralight text-sky-400/20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  schema
                </motion.span>
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

            {/* Security */}
            <motion.div
              className="bento-card p-10 flex flex-col justify-between rounded-xl min-h-[280px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex flex-col gap-6">
                <span className="material-symbols-outlined text-[28px] text-sky-400 bg-sky-500/10 p-3 rounded-lg self-start">
                  shield_lock
                </span>
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

            {/* Scale */}
            <motion.div
              className="bento-card p-10 flex flex-col justify-between rounded-xl min-h-[280px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col gap-6">
                <span className="material-symbols-outlined text-[28px] text-sky-400 bg-sky-500/10 p-3 rounded-lg self-start">
                  dynamic_form
                </span>
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

            {/* Suite */}
            <motion.div
              className="bento-card md:col-span-3 p-10 flex flex-col md:flex-row items-center gap-12 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="hidden md:block w-px h-24 bg-white/[0.06]" />
              <div className="w-full md:w-1/4 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-eye-text">
                  <span>SYSTEM LATENCY</span>
                  <span className="text-sky-400 font-bold">&lt;4ms</span>
                </div>
                <div className="w-full bg-white/[0.06] h-[1px]" />
                <div className="flex justify-between items-center text-[10px] font-mono text-eye-text">
                  <span>AVAILABILITY</span>
                  <span className="text-white font-bold">99.999%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Human Expertise Section */}
      <section className="py-32 px-6 w-full flex justify-center bg-[#030304] border-t border-white/[0.04] relative z-10">
        <div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400 mb-6">
              Expertise
            </h2>
            <h3 className="text-4xl md:text-5xl font-display font-medium text-eye-white tracking-tight leading-tight mb-8">
              Human insight,
              <br />
              algorithmically amplified.
            </h3>
            <p className="text-eye-text text-base md:text-lg font-light leading-relaxed mb-10">
              Beyond the code, EyeX is built on the expertise of world-class engineers, designers,
              and industry veterans. We believe that true intelligence requires human perspective to
              remain grounded and ethical.
            </p>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-sky-400 text-[24px] bg-sky-500/10 p-2.5 rounded-lg">
                verified_user
              </span>
              <div>
                <h5 className="text-eye-white font-medium mb-1 text-sm">Principled Design</h5>
                <p className="text-xs text-eye-text font-light">
                  Every model is refined by subject matter experts to ensure real-world utility.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative aspect-[4/5] overflow-hidden border border-white/[0.04] bg-black/40 rounded-2xl flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#030304] to-transparent z-10" />
            <motion.span
              className="material-symbols-outlined text-[100px] font-extralight text-sky-400/5 z-20"
              animate={{ rotate: [0, 3, 0, -3, 0] }}
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
