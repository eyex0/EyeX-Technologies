import { ArrowRight, Brain, ShieldCheck, Layers, Globe } from "lucide-react";

export function AboutPage() {
  return (
    <>
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-brand/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary-brand/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full h-16 bg-eye-bg/60 glass-nav border-b border-eye-border z-50">
        <div className="flex justify-between items-center px-6 max-w-[1200px] mx-auto h-full">
          <div className="flex items-center gap-2 cursor-pointer transition-all active:scale-95">
            <img
              alt="EyeX Logo"
              className="w-8 h-8 invert"
              src="https://lh3.googleusercontent.com/aida/AP1WRLsQOWY1jiM2rbry7lohts-Rb8_y4zW5SHQStQwUwZ7oRfScVQ-WnE_KkvjHfnAFef-rz3vFxxUwxqL35TXLlYCqr9Bt61-ISaqM3cE4jyBF0ITRu_SosGsY9YAlga5THtqKeXjGOQJ_lMLRlpta0-d30nL1jxOIq3bzjfw_kDejF1OHgVW9D51iQqIWU5o9vS9kC6vcfnW3hsnsx3fqZjLo8MRWaeESFBRA7UajDJpDR0AJI2QkCQI0qNA"
            />
            <span className="text-2xl tracking-tighter text-eye-white font-medium">
              EyeX
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14px] leading-[1.6] text-eye-text">
            <a className="hover:text-eye-white transition-colors duration-300" href="#">
              Network
            </a>
            <a className="hover:text-eye-white transition-colors duration-300" href="#">
              Infrastructure
            </a>
            <a className="hover:text-eye-white transition-colors duration-300 font-medium text-eye-white" href="#">
              Intelligence
            </a>
            <a className="hover:text-eye-white transition-colors duration-300" href="#">
              Enterprise
            </a>
          </div>
          <button className="bg-[#FAFAFA] text-[#050505] px-6 py-2 rounded-full text-[14px] leading-[1.6] font-medium hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all active:scale-95">
            Deploy Now
          </button>
        </div>
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem] text-center relative" data-fade-up>
          <div className="inline-block px-4 py-1 mb-6 rounded-full border border-eye-border bg-eye-surface text-primary-brand font-mono text-[12px] tracking-[0.15em] uppercase">
            Established MMXIX
          </div>
          <h1 className="text-[48px] md:text-[72px] font-medium mb-6 tracking-tight leading-[1.1]">
            About EyeX Technologies
          </h1>
          <p className="text-[20px] leading-[1.6] text-eye-text max-w-2xl mx-auto">
            Architecting the substrate for the next era of computational
            sovereignty. High-precision infrastructure for the formidable
            enterprise.
          </p>
        </section>

        {/* Mission Statement */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem]" data-fade-up>
          <div className="p-12 md:p-24 rounded-3xl border border-eye-border bg-eye-surface/50 relative overflow-hidden text-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none" />
            <h2
              className="font-medium text-3xl md:text-5xl leading-tight max-w-4xl mx-auto"
              style={{
                background: "linear-gradient(to bottom right, #FAFAFA 30%, #38BDF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              "Our mission is to decouple technical capability from geographic
              limitation, creating a seamless global fabric of intelligence."
            </h2>
          </div>
        </section>

        {/* Stats Row */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bento-card p-10 rounded-2xl text-center" data-fade-up>
              <div className="text-primary-brand text-[72px] font-medium mb-2 font-bold leading-[1.1]">
                120+
              </div>
              <div className="text-eye-white text-lg mb-1 font-medium">
                Research Force
              </div>
              <div className="text-eye-text text-[14px] leading-[1.6]">
                Dedicated PhDs in Neural Architecture
              </div>
            </div>
            <div className="bento-card p-10 rounded-2xl text-center" data-fade-up>
              <div className="text-primary-brand text-[72px] font-medium mb-2 font-bold leading-[1.1]">
                4
              </div>
              <div className="text-eye-white text-lg mb-1 font-medium">
                Global Hubs
              </div>
              <div className="text-eye-text text-[14px] leading-[1.6]">
                Distributed Infrastructure Nodes
              </div>
            </div>
            <div className="bento-card p-10 rounded-2xl text-center" data-fade-up>
              <div className="text-primary-brand text-[72px] font-medium mb-2 font-bold leading-[1.1]">
                ∞
              </div>
              <div className="text-eye-white text-lg mb-1 font-medium">
                Scalability
              </div>
              <div className="text-eye-text text-[14px] leading-[1.6]">
                Boundless Computational Commitment
              </div>
            </div>
          </div>
        </section>

        {/* Evolution Timeline */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem]">
          <div className="text-center mb-16" data-fade-up>
            <h3 className="text-[36px] mb-4 font-medium leading-[1.2] tracking-[-0.01em]">
              The Evolution
            </h3>
            <p className="text-eye-text text-[14px] leading-[1.6]">
              The trajectory of computational dominance.
            </p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] timeline-line -translate-x-1/2" />
            <div className="space-y-24 relative">
              {/* 2019 */}
              <div className="flex flex-col md:flex-row items-center justify-between" data-fade-up>
                <div className="md:w-5/12 text-center md:text-right">
                  <h4 className="text-[72px] font-medium text-primary-brand mb-2 tracking-tight leading-[1.1]">
                    2019
                  </h4>
                  <p className="text-eye-white font-medium">
                    Founding in Cairo
                  </p>
                  <p className="text-eye-text text-sm">
                    Initiating the vision of edge intelligence in North
                    Africa's tech hub.
                  </p>
                </div>
                <div className="w-4 h-4 bg-primary-brand rounded-full z-10 my-4 md:my-0 shadow-[0_0_15px_#38BDF8]" />
                <div className="md:w-5/12 hidden md:block" />
              </div>
              {/* 2021 */}
              <div className="flex flex-col md:flex-row items-center justify-between" data-fade-up>
                <div className="md:w-5/12 hidden md:block" />
                <div className="w-4 h-4 bg-primary-brand rounded-full z-10 my-4 md:my-0 shadow-[0_0_15px_#38BDF8]" />
                <div className="md:w-5/12 text-center md:text-left">
                  <h4 className="text-[72px] font-medium text-primary-brand mb-2 tracking-tight leading-[1.1]">
                    2021
                  </h4>
                  <p className="text-eye-white font-medium">
                    Expansion to Milan
                  </p>
                  <p className="text-eye-text text-sm">
                    Strategic European node integration for low-latency
                    enterprise operations.
                  </p>
                </div>
              </div>
              {/* 2024 */}
              <div className="flex flex-col md:flex-row items-center justify-between" data-fade-up>
                <div className="md:w-5/12 text-center md:text-right">
                  <h4 className="text-[72px] font-medium text-primary-brand mb-2 tracking-tight leading-[1.1]">
                    2024
                  </h4>
                  <p className="text-eye-white font-medium">
                    Launch of QORX Flagship
                  </p>
                  <p className="text-eye-text text-sm">
                    The world's first fully autonomous AI infrastructure
                    deployment system.
                  </p>
                </div>
                <div className="w-4 h-4 bg-primary-brand rounded-full z-10 my-4 md:my-0 shadow-[0_0_15px_#38BDF8]" />
                <div className="md:w-5/12 hidden md:block" />
              </div>
              {/* 2026 */}
              <div className="flex flex-col md:flex-row items-center justify-between" data-fade-up>
                <div className="md:w-5/12 hidden md:block" />
                <div className="w-4 h-4 bg-primary-brand rounded-full z-10 my-4 md:my-0 shadow-[0_0_15px_#38BDF8]" />
                <div className="md:w-5/12 text-center md:text-left">
                  <h4 className="text-[72px] font-medium text-primary-brand mb-2 tracking-tight leading-[1.1]">
                    2026
                  </h4>
                  <p className="text-eye-white font-medium">Global Scale</p>
                  <p className="text-eye-text text-sm">
                    Ubiquitous computational presence across every major
                    technological corridor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem]">
          <h3 className="text-[36px] mb-12 text-center font-medium leading-[1.2] tracking-[-0.01em]">
            Core Principles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bento-card p-8 rounded-xl group" data-fade-up>
              <div className="w-12 h-12 bg-primary-brand/10 border border-primary-brand/20 rounded-lg flex items-center justify-center mb-6 text-primary-brand group-hover:scale-110 transition-transform">
                <Brain size={24} />
              </div>
              <h5 className="text-eye-white font-medium mb-3">
                Intelligence
              </h5>
              <p className="text-eye-text text-[14px] leading-[1.6]">
                Sub-millisecond inference across a globally distributed mesh
                network.
              </p>
            </div>
            <div className="bento-card p-8 rounded-xl group" data-fade-up>
              <div className="w-12 h-12 bg-primary-brand/10 border border-primary-brand/20 rounded-lg flex items-center justify-center mb-6 text-primary-brand group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h5 className="text-eye-white font-medium mb-3">Trust</h5>
              <p className="text-eye-text text-[14px] leading-[1.6]">
                Encryption baked into the hardware layer. Security that never
                sleeps.
              </p>
            </div>
            <div className="bento-card p-8 rounded-xl group" data-fade-up>
              <div className="w-12 h-12 bg-primary-brand/10 border border-primary-brand/20 rounded-lg flex items-center justify-center mb-6 text-primary-brand group-hover:scale-110 transition-transform">
                <Layers size={24} />
              </div>
              <h5 className="text-eye-white font-medium mb-3">
                Simplicity
              </h5>
              <p className="text-eye-text text-[14px] leading-[1.6]">
                Complex infrastructure reduced to a single, intuitive API
                interaction.
              </p>
            </div>
            <div className="bento-card p-8 rounded-xl group" data-fade-up>
              <div className="w-12 h-12 bg-primary-brand/10 border border-primary-brand/20 rounded-lg flex items-center justify-center mb-6 text-primary-brand group-hover:scale-110 transition-transform">
                <Globe size={24} />
              </div>
              <h5 className="text-eye-white font-medium mb-3">
                Human Impact
              </h5>
              <p className="text-eye-text text-[14px] leading-[1.6]">
                Advancing human potential through surgical precision in
                technology.
              </p>
            </div>
          </div>
        </section>

        {/* Strategic Leadership */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem]">
          <h3 className="text-[36px] mb-12 text-center font-medium leading-[1.2] tracking-[-0.01em]">
            Strategic Leadership
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group" data-fade-up>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4 grayscale hover:grayscale-0 transition-all duration-500 border border-eye-border group-hover:border-primary-brand/50">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0Z3_H3MYlGtQYTxE9upBONkEO7yCVHz_eRuqyiOt-io2b3NKHw8jCqmh2pW4700S5MQVg35GoKppqWF05wV2hpERekWi7weljNJfQZCQFevEMwQF3fGa1zO-eGki1gJXyyn3nqZVECsyggmEw6sLrMdBlwOVx246IlP1Ib6TIUsfNW3o5oZRYcDSMfRDI_NN6ctR5j4mYMP_mhXuj9TP3a90c_sDtO5fLuf_hPfNAflaUvbkemaMOfH9JJFBr0cR_dm7ZG31DQGc')",
                  }}
                />
              </div>
              <h6 className="text-eye-white font-medium">Dr. Elias Vance</h6>
              <span className="text-eye-text text-xs uppercase tracking-widest font-mono">
                CEO / Founder
              </span>
            </div>
            <div className="text-center group" data-fade-up>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4 grayscale hover:grayscale-0 transition-all duration-500 border border-eye-border group-hover:border-primary-brand/50">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDuhL3hgFfGhhxyl36pu83xN2PBvbynqLY6FjoMbBgD8omeP9dL3G21IkdCgDfS9xdDpeBLAAV3dc6ha31JlOprtU3RlvrHU_hNRRjxbiL8YZ7yT2ieOcY5hsg5SNG_HgKY0kzziNyoS2Ar-kHNgcYC_LAJZ4Owr-dRyrSyUwhyKQoJu_evyZY2RP8HGJ_hQEVFsh8rsUS_XXVyWodYoOeq4B7xO8RPXqdexVGwakdEIST2zkSY99ASMJ_hD5bU6y4I9HsYqZAQEg')",
                  }}
                />
              </div>
              <h6 className="text-eye-white font-medium">Sarah Al-Zaid</h6>
              <span className="text-eye-text text-xs uppercase tracking-widest font-mono">
                Chief Network Architect
              </span>
            </div>
            <div className="text-center group" data-fade-up>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4 grayscale hover:grayscale-0 transition-all duration-500 border border-eye-border group-hover:border-primary-brand/50">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgL8Ye3Kjnq6sT2P_o5FZt0J_SdzGYDdTFZ-VFOM5Ca7N3jvig4HVEXor4u5fmtV_e9R30kUteDl6jvWBkHtOkA7_AZCYAw_X9qrPUy8Mo1EZUSiPNEp_UIZM25Ib2b3Exs94nkBFkdgplMtqvikTdcy4XDCrldSfJOeFEbcDUj1D_TnpW7WoOuNnJTSGh9pwJYh6MxaeC22NMwOrFc3oRGU8eMJ6KwQkFMmVdPR-3k1VLUE3sT6bIV7mOcVhRcOxukYJ1z33Qm48')",
                  }}
                />
              </div>
              <h6 className="text-eye-white font-medium">Marco Rossi</h6>
              <span className="text-eye-text text-xs uppercase tracking-widest font-mono">
                Operations Lead
              </span>
            </div>
            <div className="text-center group" data-fade-up>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4 grayscale hover:grayscale-0 transition-all duration-500 border border-eye-border group-hover:border-primary-brand/50">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJBLsm5S_QxrZUOrINO9gmq5gg2D39xqb-yVYHP_QHp2NIR70dFqCzjWK5i8-FkOS2cj02MK3D4GAqSfU1L4LEq1Xw9XkFacPYPBkmEIzeSBPPZgwUcM03O9PqWAo5UeKV8IacCeZCgOw08EASzZvuFO9qgpQBILZXtgAbliMkia4baja0BVKtypO3bWxWoBJilfDWFwAIEwqT8uEOpIPbpm7zCq7uqkAVx1g21Gh9FUpplPA1hVHzJ76m8h7o_r94IbobWMzMEIk')",
                  }}
                />
              </div>
              <h6 className="text-eye-white font-medium">Chen Wei</h6>
              <span className="text-eye-text text-xs uppercase tracking-widest font-mono">
                Head of Security
              </span>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-w-[1200px] mx-auto px-6 mb-[6rem]" data-fade-up>
          <div className="relative py-24 rounded-[3rem] border border-eye-border bg-eye-surface overflow-hidden text-center">
            <div className="relative z-10">
              <h2 className="text-[48px] md:text-5xl mb-8 tracking-tighter font-medium">
                Ready for Dominance?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="bg-[#FAFAFA] text-[#050505] px-10 py-4 rounded-full font-medium hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto">
                  Deploy Infrastructure
                </button>
                <button className="bg-transparent text-white border border-[#27272A] px-10 py-4 rounded-full font-medium hover:border-primary-brand hover:text-primary-brand transition-all transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto">
                  Speak to an Architect
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-eye-bg border-t border-eye-border py-[6rem]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[2.5rem] max-w-[1200px] mx-auto px-6">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img
                alt="EyeX Logo"
                className="w-6 h-6 invert"
                src="https://lh3.googleusercontent.com/aida/AP1WRLsQOWY1jiM2rbry7lohts-Rb8_y4zW5SHQStQwUwZ7oRfScVQ-WnE_KkvjHfnAFef-rz3vFxxUwxqL35TXLlYCqr9Bt61-ISaqM3cE4jyBF0ITRu_SosGsY9YAlga5THtqKeXjGOQJ_lMLRlpta0-d30nL1jxOIq3bzjfw_kDejF1OHgVW9D51iQqIWU5o9vS9kC6vcfnW3hsnsx3fqZjLo8MRWaeESFBRA7UajDJpDR0AJI2QkCQI0qNA"
              />
              <span className="text-xl tracking-tighter text-eye-white font-medium">
                EyeX
              </span>
            </div>
            <p className="text-eye-text text-sm leading-relaxed mb-6">
              © 2024 EyeX Systems. All rights reserved. Precise. Powerful.
              Formidable.
            </p>
          </div>
          <div>
            <h6 className="text-eye-white font-mono text-[12px] tracking-[0.15em] mb-6">
              Resources
            </h6>
            <ul className="space-y-4 text-[14px] leading-[1.6] text-eye-text">
              <li>
                <a className="hover:text-primary-brand transition-colors" href="#">
                  Documentation
                </a>
              </li>
              <li>
                <a className="hover:text-primary-brand transition-colors" href="#">
                  Changelog
                </a>
              </li>
              <li>
                <a className="hover:text-primary-brand transition-colors" href="#">
                  Network Status
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-eye-white font-mono text-[12px] tracking-[0.15em] mb-6">
              Company
            </h6>
            <ul className="space-y-4 text-[14px] leading-[1.6] text-eye-text">
              <li>
                <a className="hover:text-primary-brand transition-colors" href="#">
                  About Us
                </a>
              </li>
              <li>
                <a className="hover:text-primary-brand transition-colors" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="hover:text-primary-brand transition-colors" href="#">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-eye-white font-mono text-[12px] tracking-[0.15em] mb-6">
              Legal
            </h6>
            <ul className="space-y-4 text-[14px] leading-[1.6] text-eye-text">
              <li>
                <a className="hover:text-primary-brand transition-colors" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-primary-brand transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-primary-brand transition-colors" href="#">
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
