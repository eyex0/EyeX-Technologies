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

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

export function AboutPage() {
  return (
    <div className="relative min-h-screen bg-eye-bg overflow-hidden bg-radial-mesh">
      {/* Grid overlay */}
      <div className="absolute inset-0 ambient-grid pointer-events-none opacity-30" />

      {/* Ambient glows */}
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[450px] h-[450px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center pt-24 relative overflow-hidden">
        <div className="relative z-20 max-w-[1200px] mx-auto px-6 w-full">
          <motion.div
            className="max-w-3xl space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={cardVariants}
              className="font-mono text-[10px] text-sky-400 tracking-[0.25em] uppercase font-semibold"
            >
              Company Manifesto
            </motion.span>
            <motion.h1
              variants={cardVariants}
              className="text-4xl sm:text-6xl md:text-7xl font-display font-medium text-white leading-[1.05] tracking-[-0.03em]"
            >
              Building the intelligence layer for the world's most ambitious companies.
            </motion.h1>
            <motion.p
              variants={cardVariants}
              className="text-base sm:text-lg text-eye-text max-w-xl font-light leading-relaxed"
            >
              EyeX builds advanced AI systems that connect human expertise with machine
              intelligence, creating a formidable advantage for modern enterprises.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-[#050507]/90 relative overflow-hidden border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400">
                Our Mission
              </h2>
              <h3 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
                AI as a Competitive Advantage
              </h3>
              <p className="text-eye-text text-sm font-light leading-relaxed">
                AI should not be limited to a few companies. EyeX is building the infrastructure
                that allows every ambitious organization to use intelligence as a competitive
                advantage. We believe in high-precision engineering and absolute security.
              </p>
            </motion.div>

            <motion.div
              className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.05] bg-black/40 flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-transparent" />
              {/* Micro-interaction overlay */}
              <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-black/60 px-4 py-2 border border-white/[0.08] rounded-full backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span className="font-mono text-[9px] text-sky-400 uppercase tracking-widest leading-none">
                  System Status: Active
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cinematic Timeline */}
      <section className="py-32 border-t border-white/[0.04] bg-[#030304]/80">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400">
              How EyeX Began
            </h2>
            <p className="text-2xl md:text-3xl font-display text-white mt-4 tracking-tight">
              The evolution of computational dominance
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.08] -translate-x-1/2" />

            {/* Timeline Item 1 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 group">
              <motion.div
                className="md:text-right"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="font-display text-5xl md:text-6xl text-white/10 group-hover:text-sky-400/30 transition-colors duration-500 font-bold">
                  2018
                </span>
                <h3 className="text-lg font-medium text-white mt-2">Cairo</h3>
              </motion.div>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="font-mono text-[9px] text-sky-400 tracking-[0.2em] font-semibold">
                  THE FIRST QUESTION
                </p>
                <p className="text-xs text-eye-text font-light leading-relaxed">
                  Engineering studies in Cairo focused on pattern recognition. We asked why data was
                  plentiful but intelligence was scarce.
                </p>
              </motion.div>
              <div className="absolute left-1/2 top-10 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-eye-bg border-2 border-sky-400 z-10" />
            </div>

            {/* Timeline Item 2 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 group">
              <motion.div
                className="order-1 md:order-2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="font-display text-5xl md:text-6xl text-white/10 group-hover:text-sky-400/30 transition-colors duration-500 font-bold">
                  2021
                </span>
                <h3 className="text-lg font-medium text-white mt-2">Milan</h3>
              </motion.div>
              <motion.div
                className="md:text-right space-y-4 order-2 md:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="font-mono text-[9px] text-sky-400 tracking-[0.2em] font-semibold">
                  THE PATTERN BECAME CLEAR
                </p>
                <p className="text-xs text-eye-text font-light leading-relaxed">
                  Refining neural architectures in Italy. The gap between information storage and
                  intelligence processing became our obsession.
                </p>
              </motion.div>
              <div className="absolute left-1/2 top-10 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-eye-bg border-2 border-sky-400 z-10" />
            </div>

            {/* Timeline Item 3 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 group">
              <motion.div
                className="md:text-right"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="font-display text-5xl md:text-6xl text-white/10 group-hover:text-sky-400/30 transition-colors duration-500 font-bold">
                  2023
                </span>
                <h3 className="text-lg font-medium text-white mt-2">Oviedo</h3>
              </motion.div>
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="font-mono text-[9px] text-sky-400 tracking-[0.2em] font-semibold">
                  THE AI OPPORTUNITY
                </p>
                <p className="text-xs text-eye-text font-light leading-relaxed">
                  Fragmented technology vs. a unified global challenge. We realized the world needed
                  a singular, formidable AI backbone.
                </p>
              </motion.div>
              <div className="absolute left-1/2 top-10 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-eye-bg border-2 border-sky-400 z-10" />
            </div>

            {/* Timeline Item 4 */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 group">
              <motion.div
                className="order-1 md:order-2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="font-display text-5xl md:text-6xl text-white/10 group-hover:text-sky-400/30 transition-colors duration-500 font-bold">
                  2024
                </span>
                <h3 className="text-lg font-medium text-white mt-2">Milan</h3>
              </motion.div>
              <motion.div
                className="md:text-right space-y-4 order-2 md:order-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="font-mono text-[9px] text-sky-400 tracking-[0.2em] font-semibold">
                  EYEX IS BORN
                </p>
                <p className="text-xs text-eye-text font-light leading-relaxed">
                  Official launch. Deploying QORX as the flagship platform for those who refuse to
                  compromise on power.
                </p>
              </motion.div>
              <div className="absolute left-1/2 top-10 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-eye-bg border-2 border-sky-400 z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-eye-bg relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value Card 1 */}
            <motion.div
              className="p-8 bg-eye-surface border border-white/[0.04] rounded-xl hover:border-sky-500/20 transition-all duration-300 flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="material-symbols-outlined text-sky-400 text-3xl">psychology</span>
              <h4 className="text-lg font-medium text-white">Intelligence</h4>
              <p className="text-xs text-eye-text leading-relaxed font-light">
                Pushing the boundaries of what machine reasoning can achieve in real-time
                environments.
              </p>
            </motion.div>

            {/* Value Card 2 */}
            <motion.div
              className="p-8 bg-eye-surface border border-white/[0.04] rounded-xl hover:border-sky-500/20 transition-all duration-300 flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="material-symbols-outlined text-sky-400 text-3xl">verified_user</span>
              <h4 className="text-lg font-medium text-white">Trust</h4>
              <p className="text-xs text-eye-text leading-relaxed font-light">
                Built with an intelligence-first security posture. Your sovereignty is our
                architecture.
              </p>
            </motion.div>

            {/* Value Card 3 */}
            <motion.div
              className="p-8 bg-eye-surface border border-white/[0.04] rounded-xl hover:border-sky-500/20 transition-all duration-300 flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="material-symbols-outlined text-sky-400 text-3xl">architecture</span>
              <h4 className="text-lg font-medium text-white">Simplicity</h4>
              <p className="text-xs text-eye-text leading-relaxed font-light">
                Hiding the complexity. Precise interfaces that allow you to command vast compute
                effortlessly.
              </p>
            </motion.div>

            {/* Value Card 4 */}
            <motion.div
              className="p-8 bg-eye-surface border border-white/[0.04] rounded-xl hover:border-sky-500/20 transition-all duration-300 flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="material-symbols-outlined text-sky-400 text-3xl">groups</span>
              <h4 className="text-lg font-medium text-white">Human Impact</h4>
              <p className="text-xs text-eye-text leading-relaxed font-light">
                Technology is a tool for human brilliance. We build to amplify, not replace, our
                users.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 border-t border-white/[0.04] relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-end justify-between mb-16">
            <div className="max-w-2xl">
              <span className="font-mono text-[10px] text-sky-400 mb-4 block tracking-widest font-semibold uppercase">
                OUR ARCHITECTS
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight leading-none">
                Built by people who believe intelligence should be accessible.
              </h2>
            </div>
            <div className="pb-2">
              <Link
                to="/dashboard"
                className="text-xs text-eye-text hover:text-sky-400 transition-colors flex items-center gap-2 group"
              >
                Explore Dashboard{" "}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[14px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          <motion.div
            className="relative overflow-hidden rounded-2xl aspect-[21/9] border border-white/[0.05] bg-black/40 mb-12 flex items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-eye-bg/90 via-transparent to-transparent z-10" />
            <span className="material-symbols-outlined text-[100px] font-extralight text-sky-400/5 z-20">
              group
            </span>
            <div className="absolute bottom-12 left-12 z-20">
              <div className="flex gap-12">
                <div>
                  <p className="text-3xl md:text-5xl font-display text-white font-medium">120+</p>
                  <p className="font-mono text-[9px] text-sky-400 opacity-80 uppercase tracking-widest mt-1">
                    PHD RESEARCHERS
                  </p>
                </div>
                <div>
                  <p className="text-3xl md:text-5xl font-display text-white font-medium">4</p>
                  <p className="font-mono text-[9px] text-sky-400 opacity-80 uppercase tracking-widest mt-1">
                    GLOBAL HUBS
                  </p>
                </div>
                <div>
                  <p className="text-3xl md:text-5xl font-display text-white font-medium">∞</p>
                  <p className="font-mono text-[9px] text-sky-400 opacity-80 uppercase tracking-widest mt-1">
                    COMMITMENT
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-[#050507]/60 border-t border-white/[0.04] relative overflow-hidden z-10">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-6xl font-display font-medium text-white mb-12 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Building the future of intelligent systems.
          </motion.h2>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Link
              to="/dashboard"
              className="luminous-btn-primary h-[50px] px-10 font-bold text-[10px] uppercase tracking-widest w-full sm:w-auto"
            >
              Explore QORX
            </Link>
            <a
              href="mailto:hello@eyex.io"
              className="luminous-btn-secondary h-[50px] px-10 font-bold text-[10px] uppercase tracking-widest w-full sm:w-auto"
            >
              Partner with EyeX
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
