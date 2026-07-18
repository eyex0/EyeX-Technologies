import { ArrowRight } from "lucide-react";

const VALUES = [
  { icon: "🧠", title: "Intelligence", desc: "Pushing the boundaries of what machine reasoning can achieve in real-time environments." },
  { icon: "🛡️", title: "Trust", desc: "Built with an intelligence-first security posture. Your sovereignty is our architecture." },
  { icon: "⚡", title: "Simplicity", desc: "Hiding the complexity. Precise interfaces that allow you to command vast compute effortlessly." },
  { icon: "👥", title: "Human Impact", desc: "Technology is a tool for human brilliance. We build to amplify, not replace, our users." },
];

export function AboutPage() {
  return (
    <>
      {/* Hero with background image */}
      <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-eye-bg via-eye-bg/80 to-transparent z-10" />
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.08)_0%,_transparent_70%)]" />
        </div>
        <div className="relative z-20 max-w-[1200px] mx-auto px-6 w-full">
          <div className="max-w-3xl space-y-8" data-fade-up>
            <span className="text-[12px] font-mono text-primary tracking-[0.15em] uppercase">Company Manifesto</span>
            <h1 className="text-4xl md:text-7xl font-display font-medium text-eye-white tracking-[-0.02em] leading-[1.1]">
              Building the intelligence layer for the world's most ambitious companies.
            </h1>
            <p className="text-xl text-eye-text font-light max-w-xl leading-relaxed">
              EyeX builds advanced AI systems that connect human expertise with machine intelligence, creating a formidable advantage for modern enterprises.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6" data-fade-up>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-eye-white tracking-tight">Our Mission</h2>
            <p className="text-lg text-eye-text leading-relaxed">
              AI should not be limited to a few companies. EyeX is building the infrastructure that allows every ambitious organization to use intelligence as a competitive advantage. We believe in high-precision engineering and absolute security.
            </p>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden premium-border" data-fade-up>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            <div className="absolute bottom-8 left-8 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[12px] font-mono text-primary opacity-80 uppercase tracking-wider">System Status: Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Timeline */}
      <section className="py-24 px-6 border-t border-eye-border bg-[#070708]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24" data-fade-up>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-eye-white tracking-tight">How EyeX Began</h2>
            <p className="text-sm text-eye-text mt-4 font-light">The evolution of computational dominance</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 timeline-line -translate-x-1/2" />
            {[
              { year: "2018", place: "Cairo", label: "THE FIRST QUESTION", desc: "Engineering studies in Cairo focused on pattern recognition. We asked why data was plentiful but intelligence was scarce." },
              { year: "2021", place: "Milan", label: "THE PATTERN BECAME CLEAR", desc: "Refining neural architectures in Italy. The gap between information storage and intelligence processing became our obsession." },
              { year: "2023", place: "Oviedo", label: "THE AI OPPORTUNITY", desc: "Fragmented technology vs. a unified global challenge. We realized the world needed a singular, formidable AI backbone." },
              { year: "2024", place: "Milan", label: "EYEX IS BORN", desc: "Official launch. Deploying QORX as the flagship platform for those who refuse to compromise on power." },
            ].map((item, i) => (
              <div key={i} className={`relative grid grid-cols-1 md:grid-cols-2 gap-12 ${i < 3 ? "mb-32" : ""}`} data-fade-up>
                <div className={`${i % 2 === 0 ? "md:text-right" : "order-1 md:order-2"}`}>
                  <span className="text-5xl md:text-7xl font-display font-medium text-primary/20 tracking-tight transition-colors duration-500 hover:text-primary">{item.year}</span>
                  <h3 className="text-2xl font-display font-medium text-eye-white mt-2">{item.place}</h3>
                </div>
                <div className={`space-y-4 ${i % 2 === 0 ? "" : "md:text-right order-2 md:order-1"}`}>
                  <p className="text-[12px] font-mono text-primary tracking-[0.2em] uppercase">{item.label}</p>
                  <p className="text-sm text-eye-text font-light leading-relaxed">{item.desc}</p>
                </div>
                <div className={`absolute left-1/2 top-10 -translate-x-1/2 w-3 h-3 rounded-full bg-eye-bg border-2 border-primary z-10 transition-all ${i === 3 ? "glow-hover" : ""}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="p-8 bg-eye-surface premium-border rounded-xl group hover:border-eye-border-hover transition-all duration-300" data-fade-up>
                <div className="text-3xl mb-6">{v.icon}</div>
                <h4 className="text-xl font-display font-medium text-eye-white mb-4">{v.title}</h4>
                <p className="text-sm text-eye-text font-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 border-t border-eye-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-end justify-between mb-16" data-fade-up>
            <div className="max-w-2xl">
              <span className="text-[12px] font-mono text-primary mb-4 block tracking-[0.15em] uppercase">Our Architects</span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-eye-white tracking-tight">Built by people who believe intelligence should be accessible.</h2>
            </div>
            <div className="pb-2">
              <span className="text-sm text-eye-text hover:text-primary transition-colors flex items-center gap-2 cursor-pointer group">
                Join the team <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl aspect-[21/9] premium-border mb-12" data-fade-up>
            <div className="w-full h-full bg-gradient-to-br from-eye-surface via-eye-bg to-eye-surface flex items-center justify-center">
              <span className="text-[80px] font-extralight text-eye-white font-display opacity-5">EX</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-eye-bg/80 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12">
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-display font-medium text-eye-white">120+</p>
                  <p className="text-[12px] font-mono text-primary opacity-60 tracking-wider uppercase">PhD Researchers</p>
                </div>
                <div>
                  <p className="text-4xl font-display font-medium text-eye-white">4</p>
                  <p className="text-[12px] font-mono text-primary opacity-60 tracking-wider uppercase">Global Hubs</p>
                </div>
                <div>
                  <p className="text-4xl font-display font-medium text-eye-white">&infin;</p>
                  <p className="text-[12px] font-mono text-primary opacity-60 tracking-wider uppercase">Commitment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#0A0A0C] border-t border-eye-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10" data-fade-up>
          <h2 className="text-4xl md:text-7xl font-display font-medium text-eye-white tracking-tight mb-8">
            Building the future of intelligent systems.
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button className="luminous-btn-primary px-10 py-4 rounded-full text-lg font-medium hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all active:scale-95 w-full md:w-auto">
              Explore QORX
            </button>
            <button className="luminous-btn-secondary px-10 py-4 rounded-full text-lg font-medium transition-all active:scale-95 w-full md:w-auto">
              Partner with EyeX
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
