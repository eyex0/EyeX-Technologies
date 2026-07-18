export function DocumentsPage() {
  return (
    <>
<div className="ambient-orb -top-48 -right-48"></div>
<div className="ambient-orb -bottom-48 -left-48"></div>
{/* TopNavBar (Shared Component) */}

<main className="pt-24 pb-section-padding max-w-container-max mx-auto px-gutter min-h-screen">
{/* Header / Context */}
<div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
<div>
<div className="flex items-center gap-2 mb-2">
<span className="font-label-mono text-primary text-[10px] tracking-[0.2em] uppercase">Intelligence Core</span>
<div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
</div>
<h1 className="font-display-lg text-display-lg-mobile text-on-surface mb-2">RAG Knowledge Bases</h1>
<p className="font-body-sm text-eye-text max-w-xl">Manage high-density neural context repositories for federated enterprise intelligence. Ensure data consistency and vector optimization across your distributed management cluster.</p>
</div>
<div className="flex items-center gap-3">
<div className="flex items-center bg-eye-surface border border-eye-border rounded-sm px-3 py-2 w-64 group focus-within:border-primary/50 transition-all">
<span className="material-symbols-outlined text-eye-text group-focus-within:text-primary transition-colors mr-2">search</span>
<input className="bg-transparent border-none p-0 focus:ring-0 text-body-sm w-full placeholder:text-eye-text/50" placeholder="Filter documents..." type="text" />
</div>
<button className="flex items-center gap-2 bg-eye-surface border border-eye-border text-on-surface px-4 py-2 rounded-sm font-label-mono text-[12px] hover:border-eye-border-hover hover:bg-eye-border/10 transition-all">
<span className="material-symbols-outlined">upload_file</span>
          Upload
        </button>
</div>
</div>
{/* Data Statistics Bar */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-stack-md">
<div className="bg-eye-surface border border-eye-border p-4 rounded-sm">
<span className="font-label-mono text-eye-text text-[10px] block mb-1">TOTAL DOCUMENTS</span>
<span className="font-display-lg text-[24px] text-on-surface">1,402</span>
</div>
<div className="bg-eye-surface border border-eye-border p-4 rounded-sm">
<span className="font-label-mono text-eye-text text-[10px] block mb-1">TOTAL TOKENS</span>
<span className="font-display-lg text-[24px] text-on-surface">84.2M</span>
</div>
<div className="bg-eye-surface border border-eye-border p-4 rounded-sm">
<span className="font-label-mono text-eye-text text-[10px] block mb-1">INDEXING LATENCY</span>
<span className="font-display-lg text-[24px] text-primary">14ms</span>
</div>
<div className="bg-eye-surface border border-eye-border p-4 rounded-sm">
<span className="font-label-mono text-eye-text text-[10px] block mb-1">STORAGE CAPACITY</span>
<span className="font-display-lg text-[24px] text-on-surface">1.2 TB</span>
</div>
</div>
{/* High-Density Document Table */}
<div className="bg-eye-surface border border-eye-border rounded-sm overflow-hidden mb-section-padding">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-[#0D0D0F] border-b border-eye-border">
<tr>
<th className="px-4 py-3 font-label-mono text-[11px] text-eye-text uppercase tracking-widest">Name</th>
<th className="px-4 py-3 font-label-mono text-[11px] text-eye-text uppercase tracking-widest">Type</th>
<th className="px-4 py-3 font-label-mono text-[11px] text-eye-text uppercase tracking-widest">Size</th>
<th className="px-4 py-3 font-label-mono text-[11px] text-eye-text uppercase tracking-widest">Status</th>
<th className="px-4 py-3 font-label-mono text-[11px] text-eye-text uppercase tracking-widest">Token Count</th>
<th className="px-4 py-3 font-label-mono text-[11px] text-eye-text uppercase tracking-widest text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-[#1A1A1C]">
{/* Row 1 */}
<tr className="data-table-row transition-colors group">
<td className="px-4 py-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">description</span>
<div>
<div className="text-on-surface font-medium">Enterprise_Strategy_2025.pdf</div>
<div className="text-[10px] text-eye-text font-label-mono">Last modified: 2h ago</div>
</div>
</div>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">PDF / Application</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">12.4 MB</td>
<td className="px-4 py-2">
<span className="status-indexed px-2 py-0.5 rounded-full text-[10px] font-label-mono flex items-center w-fit gap-1">
<span className="w-1 h-1 rounded-full bg-primary"></span>
                  Indexed
                </span>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-on-surface">428,102</td>
<td className="px-4 py-2 text-right">
<button className="material-symbols-outlined text-eye-text hover:text-on-surface transition-colors">more_vert</button>
</td>
</tr>
{/* Row 2 */}
<tr className="data-table-row transition-colors group">
<td className="px-4 py-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-tertiary">database</span>
<div>
<div className="text-on-surface font-medium">Customer_Feedback_Cluster_A.json</div>
<div className="text-[10px] text-eye-text font-label-mono">Last modified: 4h ago</div>
</div>
</div>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">JSON / Data</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">45.8 MB</td>
<td className="px-4 py-2">
<span className="status-processing px-2 py-0.5 rounded-full text-[10px] font-label-mono flex items-center w-fit gap-1">
<span className="w-1 h-1 rounded-full bg-[#a78bfa] animate-ping"></span>
                  Processing
                </span>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text italic">Calculating...</td>
<td className="px-4 py-2 text-right">
<button className="material-symbols-outlined text-eye-text hover:text-on-surface transition-colors">more_vert</button>
</td>
</tr>
{/* Row 3 */}
<tr className="data-table-row transition-colors group">
<td className="px-4 py-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">article</span>
<div>
<div className="text-on-surface font-medium">Compliance_Guidelines_v4.md</div>
<div className="text-[10px] text-eye-text font-label-mono">Last modified: 12h ago</div>
</div>
</div>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">MARKDOWN / Text</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">1.2 MB</td>
<td className="px-4 py-2">
<span className="status-indexed px-2 py-0.5 rounded-full text-[10px] font-label-mono flex items-center w-fit gap-1">
<span className="w-1 h-1 rounded-full bg-primary"></span>
                  Indexed
                </span>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-on-surface">15,400</td>
<td className="px-4 py-2 text-right">
<button className="material-symbols-outlined text-eye-text hover:text-on-surface transition-colors">more_vert</button>
</td>
</tr>
{/* Row 4 */}
<tr className="data-table-row transition-colors group">
<td className="px-4 py-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-error">warning</span>
<div>
<div className="text-on-surface font-medium">Internal_Network_Log_Dec.log</div>
<div className="text-[10px] text-error font-label-mono">Error: Corrupt File Structure</div>
</div>
</div>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">LOG / RAW</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">102.5 MB</td>
<td className="px-4 py-2">
<span className="bg-error/10 border border-error/30 text-error px-2 py-0.5 rounded-full text-[10px] font-label-mono flex items-center w-fit gap-1">
<span className="w-1 h-1 rounded-full bg-error"></span>
                  Failed
                </span>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">0</td>
<td className="px-4 py-2 text-right">
<button className="material-symbols-outlined text-eye-text hover:text-on-surface transition-colors">more_vert</button>
</td>
</tr>
{/* Row 5 */}
<tr className="data-table-row transition-colors group">
<td className="px-4 py-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">description</span>
<div>
<div className="text-on-surface font-medium">Quarterly_Report_Q3.pdf</div>
<div className="text-[10px] text-eye-text font-label-mono">Last modified: 1d ago</div>
</div>
</div>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">PDF / Application</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">8.9 MB</td>
<td className="px-4 py-2">
<span className="status-indexed px-2 py-0.5 rounded-full text-[10px] font-label-mono flex items-center w-fit gap-1">
<span className="w-1 h-1 rounded-full bg-primary"></span>
                  Indexed
                </span>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-on-surface">294,015</td>
<td className="px-4 py-2 text-right">
<button className="material-symbols-outlined text-eye-text hover:text-on-surface transition-colors">more_vert</button>
</td>
</tr>
{/* Row 6 */}
<tr className="data-table-row transition-colors group">
<td className="px-4 py-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">article</span>
<div>
<div className="text-on-surface font-medium">Training_Manual_v12.md</div>
<div className="text-[10px] text-eye-text font-label-mono">Last modified: 2d ago</div>
</div>
</div>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">MARKDOWN / Text</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-eye-text">2.4 MB</td>
<td className="px-4 py-2">
<span className="status-indexed px-2 py-0.5 rounded-full text-[10px] font-label-mono flex items-center w-fit gap-1">
<span className="w-1 h-1 rounded-full bg-primary"></span>
                  Indexed
                </span>
</td>
<td className="px-4 py-2 font-label-mono text-[11px] text-on-surface">45,120</td>
<td className="px-4 py-2 text-right">
<button className="material-symbols-outlined text-eye-text hover:text-on-surface transition-colors">more_vert</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Pagination */}
<div className="bg-[#0D0D0F] border-t border-eye-border px-4 py-3 flex items-center justify-between">
<span className="text-eye-text font-label-mono text-[10px]">SHOWING 1-6 OF 1,402 DOCUMENTS</span>
<div className="flex items-center gap-2">
<button className="w-8 h-8 flex items-center justify-center border border-eye-border rounded-sm hover:bg-eye-border/10 text-eye-text">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center bg-primary/10 border border-primary/30 rounded-sm text-primary font-label-mono text-[10px]">1</button>
<button className="w-8 h-8 flex items-center justify-center border border-eye-border rounded-sm hover:bg-eye-border/10 text-eye-text font-label-mono text-[10px]">2</button>
<button className="w-8 h-8 flex items-center justify-center border border-eye-border rounded-sm hover:bg-eye-border/10 text-eye-text font-label-mono text-[10px]">3</button>
<button className="w-8 h-8 flex items-center justify-center border border-eye-border rounded-sm hover:bg-eye-border/10 text-eye-text">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
{/* Background Feature Card Section */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="bg-eye-surface border border-eye-border rounded-sm p-6 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-[64px]" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
</div>
<h3 className="font-headline-md text-[18px] text-on-surface mb-3">Security Protocols</h3>
<p className="text-eye-text text-body-sm mb-4">Documents are encrypted with AES-256 and stored in a multi-tenant isolated architecture.</p>
<button className="text-primary font-label-mono text-[11px] flex items-center gap-2 hover:gap-3 transition-all">
          CONFIGURE POLICY <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
<div className="bg-eye-surface border border-eye-border rounded-sm p-6 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-[64px]" style={{fontVariationSettings: "'FILL' 1"}}>hub</span>
</div>
<h3 className="font-headline-md text-[18px] text-on-surface mb-3">Vector Clustering</h3>
<p className="text-eye-text text-body-sm mb-4">Auto-semantic grouping of related documents to minimize RAG hallucination and improve recall.</p>
<button className="text-primary font-label-mono text-[11px] flex items-center gap-2 hover:gap-3 transition-all">
          VIEW VIZUALIZER <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
<div className="bg-eye-surface border border-eye-border rounded-sm p-6 relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span className="material-symbols-outlined text-[64px]" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
</div>
<h3 className="font-headline-md text-[18px] text-on-surface mb-3">API Integration</h3>
<p className="text-eye-text text-body-sm mb-4">Programmatically ingest and query your knowledge base using our high-throughput REST API.</p>
<button className="text-primary font-label-mono text-[11px] flex items-center gap-2 hover:gap-3 transition-all">
          DOCS EXPLORER <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</main>
{/* Footer (Shared Component) */}
    </>
  );
}
