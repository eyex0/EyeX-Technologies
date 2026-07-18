export function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center pt-16 overflow-hidden">
        <div className="ambient-glow" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full">
          <div className="max-w-3xl space-y-6" data-fade-up>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Company Manifesto</span>
            <h1 className="text-4xl md:text-6xl font-display font-medium text-eye-white tracking-[-0.03em] leading-tight">
              Building the intelligence layer for the world's most ambitious companies.
            </h1>
            <p className="text-lg text-eye-text font-light max-w-xl leading-relaxed">
              EyeX builds advanced AI systems that connect human expertise with machine intelligence, creating a formidable advantage for modern enterprises.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-32 px-6 border-t border-eye-border">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div data-fade-up>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-eye-white tracking-tight mb-6">Our Mission</h2>
            <p className="text-base text-eye-text leading-relaxed font-light">
              AI should not be limited to a few companies. EyeX is building the infrastructure that allows every ambitious organization to use intelligence as a competitive advantage. We believe in high-precision engineering and absolute security.
            </p>
          </div>
          <div className="relative aspect-video bento-card rounded-xl overflow-hidden" data-fade-up>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            <div className="absolute bottom-8 left-8 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-primary uppercase tracking-wider">System Status: Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-32 px-6 border-t border-eye-border bg-[#070708]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-24" data-fade-up>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-eye-white tracking-tight">How EyeX Began</h2>
            <p className="text-sm text-eye-text mt-4 font-light">The evolution of computational dominance</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-eye-border -translate-x-1/2" />
            {[
              { year: "2018", place: "Cairo", label: "THE FIRST QUESTION", desc: "Engineering studies in Cairo focused on pattern recognition. We asked why data was plentiful but intelligence was scarce." },
              { year: "2021", place: "Milan", label: "THE PATTERN BECAME CLEAR", desc: "Refining neural architectures in Italy. The gap between information storage and intelligence processing became our obsession." },
              { year: "2023", place: "Oviedo", label: "THE AI OPPORTUNITY", desc: "Fragmented technology vs. a unified global challenge. We realized the world needed a singular, formidable AI backbone." },
              { year: "2024", place: "Milan", label: "EYEX IS BORN", desc: "Official launch. Deploying QORX as the flagship platform for those who refuse to compromise on power." },
            ].map((item, i) => (
              <div key={i} className={`relative grid grid-cols-1 md:grid-cols-2 gap-12 ${i < 3 ? "mb-32" : ""}`} data-fade-up>
                <div className={`${i % 2 === 0 ? "md:text-right" : "order-1 md:order-2"}`}>
                  <span className="text-5xl md:text-6xl font-display font-medium text-primary/20 tracking-tight">{item.year}</span>
                  <h3 className="text-2xl font-display font-medium text-eye-white mt-2">{item.place}</h3>
                </div>
                <div className={`space-y-4 ${i % 2 === 0 ? "" : "md:text-right order-2 md:order-1"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{item.label}</p>
                  <p className="text-sm text-eye-text font-light leading-relaxed">{item.desc}</p>
                </div>
                <div className="absolute left-1/2 top-10 -translate-x-1/2 w-3 h-3 rounded-full bg-eye-bg border-2 border-primary z-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "psychology", title: "Intelligence", desc: "Pushing the boundaries of what machine reasoning can achieve in real-time environments." },
              { icon: "verified_user", title: "Trust", desc: "Built with an intelligence-first security posture. Your sovereignty is our architecture." },
              { icon: "architecture", title: "Simplicity", desc: "Hiding the complexity. Precise interfaces that allow you to command vast compute effortlessly." },
              { icon: "groups", title: "Human Impact", desc: "Technology is a tool for human brilliance. We build to amplify, not replace, our users." },
            ].map((v, i) => (
              <div key={i} className="bento-card rounded-xl p-8 group hover:border-primary/30 transition-all duration-300" data-fade-up>
                <span className="material-symbols-outlined text-primary text-3xl mb-6">{v.icon}</span>
                <h4 className="text-xl font-display font-medium text-eye-white mb-4">{v.title}</h4>
                <p className="text-sm text-eye-text font-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team + CTA */}
      <section className="py-32 px-6 border-t border-eye-border bg-[#0A0A0C] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10" data-fade-up>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-eye-white tracking-tight mb-10">
            Building the future of intelligent systems.
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="luminous-btn-primary px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Explore QORX
            </button>
            <button className="luminous-btn-secondary px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Partner with EyeX
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
