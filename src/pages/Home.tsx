export function HomePage() {
  return (
    <>
{/* Hero Section */}
<header className="relative min-h-[85vh] w-full flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
<div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center fade-up visible">
<span className="font-label-mono text-label-mono text-primary tracking-[0.2em] uppercase mb-4 block">
  EyeX Technologies
</span>
<h1 className="text-6xl md:text-8xl font-display font-medium text-eye-white tracking-[-0.03em] leading-[1.05] mb-8">
                Intelligence,<br />Architected.
            </h1>
<p className="text-lg md:text-xl text-eye-text max-w-2xl mb-12 leading-relaxed font-light">The foundational infrastructure for the next generation of global enterprise. Secured by design, engineered for scale, and optimized for high-stakes operational environments.</p>
<div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
<button className="luminous-btn-primary h-[48px] px-10 font-bold text-[10px] uppercase tracking-widest w-full sm:w-auto">
                    Explore QORX
                </button>
<button className="luminous-btn-secondary h-[48px] px-10 font-bold text-[10px] uppercase tracking-widest w-full sm:w-auto">
                    Documentation
                </button>
</div>
</div>
</header>
{/* Capabilities Bento Grid */}
<section className="py-32 px-4 w-full flex justify-center border-t border-thin bg-eye-bg">
<div className="max-w-[1200px] w-full flex flex-col gap-16">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 fade-up visible">
<div className="max-w-xl">
<h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-eye-text mb-4">Foundation</h2>
<h3 className="text-3xl md:text-4xl font-display font-medium text-eye-white tracking-tight">Enterprise-Grade Intelligence</h3>
</div>
<p className="text-eye-text max-w-md font-light">Robust architectural standards meet pioneering computational research to deliver predictable, high-performance outcomes.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Main Feature */}
<div className="bento-card md:col-span-2 md:row-span-2 flex flex-col fade-up visible">
<div className="aspect-video w-full overflow-hidden border-b border-thin bg-black">
<div className="w-full h-full flex items-center justify-center opacity-20">
<span className="material-symbols-outlined text-[64px] font-extralight text-eye-white">schema</span>
</div>
</div>
<div className="p-10">
<h4 className="text-xl font-medium text-eye-white mb-3 tracking-tight">Proprietary Neural Architecture</h4>
<p className="text-sm text-eye-text leading-relaxed font-light max-w-lg">Our hardware-optimized models utilize specialized structural processing to eliminate latency bottlenecks inherent in general-purpose cloud computing architectures.</p>
</div>
</div>
{/* Security */}
<div className="bento-card p-10 flex flex-col justify-between fade-up visible">
<div>
<span className="material-symbols-outlined text-[24px] text-eye-white mb-6">shield_lock</span>
<h4 className="text-lg font-medium text-eye-white mb-3 tracking-tight">Immutable Security</h4>
<p className="text-sm text-eye-text font-light leading-relaxed">Zero-trust architecture with hardware-level isolation. SOC2 Type II and HIPAA compliant infrastructure for mission-critical data handling.</p>
</div>
</div>
{/* Scale */}
<div className="bento-card p-10 flex flex-col justify-between fade-up visible">
<div>
<span className="material-symbols-outlined text-[24px] text-eye-white mb-6">dynamic_form</span>
<h4 className="text-lg font-medium text-eye-white mb-3 tracking-tight">Elastic Scalability</h4>
<p className="text-sm text-eye-text font-light leading-relaxed">Instantaneous resource allocation across global nodes, ensuring consistent performance regardless of request volume or computational complexity.</p>
</div>
</div>
{/* Suite */}
<div className="bento-card md:col-span-3 p-10 flex flex-col md:flex-row items-center gap-12 fade-up visible">
<div className="flex-1">
<div className="flex items-center gap-3 mb-4 flex-wrap">
  <h4 className="text-2xl font-medium text-eye-white tracking-tight">QORX</h4>
  <span className="text-[10px] font-mono px-2.5 py-1 border border-eye-border rounded text-eye-text uppercase tracking-widest bg-eye-surface">AI Business OS</span>
</div>
<p className="text-sm text-eye-text max-w-xl mb-8 font-light leading-relaxed">From fine-tuning pipelines to real-time telemetry, our unified suite provides a single point of orchestration for the entire intelligence lifecycle.</p>
<button className="text-[10px] font-bold uppercase tracking-[0.2em] text-eye-white hover:opacity-70 transition-opacity flex items-center gap-2">
                            View Ecosystem <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
<div className="hidden md:block w-px h-24 bg-eye-border"></div>
<div className="w-full md:w-1/4 flex flex-col gap-4">
<div className="flex justify-between items-center text-[10px] font-mono text-eye-text">
<span className="">SYSTEM LATENCY</span>
<span className="text-eye-white">&lt;4ms</span>
</div>
<div className="w-full bg-eye-border h-[1px]"></div>
<div className="flex justify-between items-center text-[10px] font-mono text-eye-text">
<span className="">AVAILABILITY</span>
<span className="text-eye-white">99.999%</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Human Expertise Section */}
<section className="py-32 px-4 w-full flex justify-center bg-[#050505] border-t border-thin">
<div className="max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
<div className="fade-up visible">
<h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-eye-text mb-6">Expertise</h2>
<h3 className="text-4xl md:text-5xl font-display font-medium text-eye-white tracking-tight leading-tight mb-8">Human insight,<br />algorithmically amplified.</h3>
<p className="text-eye-text text-lg font-light leading-relaxed mb-10">Beyond the code, EyeX is built on the expertise of world-class engineers, designers, and industry veterans. We believe that true intelligence requires human perspective to remain grounded and ethical.</p>
<div className="flex flex-col gap-6">
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-eye-white text-[20px]">verified_user</span>
<div>
<h5 className="text-eye-white font-medium mb-1">Principled Design</h5>
<p className="text-sm text-eye-text font-light">Every model is refined by subject matter experts to ensure real-world utility.</p>
</div>
</div>
</div>
</div>
<div className="relative fade-up aspect-[4/5] overflow-hidden border border-thin bg-black visible">
<div className="w-full h-full flex items-center justify-center opacity-10">
<span className="material-symbols-outlined text-[120px] font-extralight text-eye-white">group</span>
</div>
</div>
</div>
</section>
    </>
  );
}
