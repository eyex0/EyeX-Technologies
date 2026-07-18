import { BaseAgent, type AgentContext, type AgentOutput } from './base';

interface NarrativeInput {
  type: 'board_deck' | 'executive_summary' | 'metric_deep_dive' | 'anomaly_report';
  metric?: string;
  timeframe?: { start: Date; end: Date };
  metrics?: string[];
  dimensions?: Record<string, string>;
  audience: 'board' | 'executive' | 'team' | 'investor';
  format: 'markdown' | 'pptx' | 'pdf' | 'notion';
}

interface NarrativeOutput extends AgentOutput {
  output: {
    content: string;
    slides?: Array<{ title: string; content: string; chart?: string }>;
    format: string;
    metadata: { generatedAt: string; metricsUsed: string[]; wordCount: number };
  };
}

interface SlideTemplate {
  title: string;
  layout: 'title' | 'metric' | 'chart' | 'two-column' | 'bullets' | 'kpi-row';
  content: (data: any) => string;
}

export class NarrativeAgent extends BaseAgent {
  private slideTemplates: Map<string, SlideTemplate[]> = new Map();

  constructor(
    llm: LLMProvider,
    db: ReturnType<typeof createClient<Database>>
  ) {
    super(llm, db);
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // Board Deck Template
    this.slideTemplates.set('board_deck', [
      { title: 'Executive Summary', layout: 'bullets', content: d => d.executiveSummary },
      { title: 'Key Metrics Overview', layout: 'kpi-row', content: d => d.kpis },
      { title: 'Revenue Performance', layout: 'chart', content: d => d.revenueChart },
      { title: 'Customer Metrics', layout: 'two-column', content: d => d.customerMetrics },
      { title: 'Operational Health', layout: 'kpi-row', content: d => d.operational },
      { title: 'Key Risks & Opportunities', layout: 'bullets', content: d => d.risks },
      { title: 'Strategic Initiatives', layout: 'two-column', content: d => d.initiatives },
      { title: 'Financial Outlook', layout: 'chart', content: d => d.forecastChart },
      { title: 'Appendix', layout: 'bullets', content: d => d.appendix },
    ]);

    // Executive Summary Template
    this.slideTemplates.set('executive_summary', [
      { title: 'Executive Summary', layout: 'title', content: d => d.title },
      { title: 'Key Highlights', layout: 'bullets', content: d => d.highlights },
      { title: 'Metrics Snapshot', layout: 'kpi-row', content: d => d.kpis },
      { title: 'Trend Analysis', layout: 'chart', content: d => d.trends },
      { title: 'Action Items', layout: 'bullets', content: d => d.actions },
    ]);

    // Metric Deep Dive Template
    this.slideTemplates.set('metric_deep_dive', [
      { title: 'Metric Overview', layout: 'title', content: d => d.title },
      { title: 'Current Performance', layout: 'kpi-row', content: d => d.current },
      { title: 'Trend Analysis', layout: 'chart', content: d => d.trendChart },
      { title: 'Drivers & Root Causes', layout: 'two-column', content: d => d.drivers },
      { title: 'Forecast & Scenarios', layout: 'chart', content: d => d.forecast },
      { title: 'Recommendations', layout: 'bullets', content: d => d.recommendations },
    ]);

    // Anomaly Report Template
    this.slideTemplates.set('anomaly_report', [
      { title: 'Anomaly Alert', layout: 'title', content: d => d.alertTitle },
      { title: 'What Happened', layout: 'bullets', content: d => d.whatHappened },
      { title: 'Root Cause Analysis', layout: 'two-column', content: d => d.rootCause },
      { title: 'Impact Assessment', layout: 'kpi-row', content: d => d.impact },
      { title: 'Recommended Actions', layout: 'bullets', content: d => d.actions },
      { title: 'Monitoring & Follow-up', layout: 'bullets', content: d => d.followup },
    ]);
  }

  async execute(input: NarrativeInput, context: AgentContext): Promise<NarrativeOutput> {
    const { type, metric, timeframe, metrics, dimensions, audience, format } = input;

    // 1. Gather data
    const data = await this.gatherData(input, context);

    // 2. Generate narrative content using LLM
    const narrative = await this.generateNarrative(input, data, context);

    // 3. Generate slides
    const slides = this.generateSlides(type, narrative, data);

    // 4. Format output
    const content = format === 'markdown' ? this.toMarkdown(slides, narrative) :
                    format === 'pptx' ? await this.toPPTX(slides, narrative) :
                    format === 'pdf' ? await this.toPDF(slides, narrative) :
                    await this.toNotion(slides, narrative);

    return {
      output: {
        content,
        slides: slides.map(s => ({ title: s.title, content: s.content, chart: s.chart })),
        format,
        metadata: {
          generatedAt: new Date().toISOString(),
          metricsUsed: metrics || [metric].filter(Boolean),
          wordCount: content.split(/\s+/).length,
        },
      },
      tokensUsed: 0,
      metadata: { slides: slides.length },
    };
  }

  private async gatherData(input: NarrativeInput, context: AgentContext): Promise<any> {
    const db = this.db;
    const orgId = context.orgId;

    // Fetch metrics
    const metricIds = [input.metric, ...(input.metrics || [])].filter(Boolean);
    const metricsData = await Promise.all(metricIds.map(async (m) => {
      const { data } = await db
        .from('metric_cache')
        .select('value, dimension_values, period_start')
        .eq('metric_id', m)
        .gte('period_start', input.timeframe?.start?.toISOString().split('T')[0] ?? '')
        .lte('period_end', input.timeframe?.end?.toISOString().split('T')[0] ?? '')
        .order('period_start');
      return { metric: m, data: data || [] };
    }));

    // Fetch anomalies
    const { data: anomalies } = await this.db
      .from('alert_incidents')
      .select('*')
      .eq('organization_id', context.orgId)
      .eq('status', 'firing')
      .order('fired_at', { ascending: false })
      .limit(5);

    // Fetch forecast
    const forecasts = await Promise.all(
      metricIds.slice(0, 3).map(async (m) => {
        const { data } = await db.rpc('get_latest_forecast', { p_metric_id: m, p_horizon: 30 });
        return { metric: m, forecast: data };
      })
    );

    // Fetch top insights
    const { data: insights } = await db
      .from('agent_runs')
      .select('output, agent_type')
      .eq('organization_id', context.orgId)
      .eq('agent_type', 'insight')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      metrics: Object.fromEntries(metricsData.map(m => [m.metric, m.data])),
      anomalies: anomalies || [],
      forecasts: Object.fromEntries(forecasts.map(f => [f.metric, f.forecast])),
      insights: (insights || []).map(i => i.output),
      timeframe: input.timeframe,
      audience: input.audience,
    };
  }

  private async generateNarrative(input: NarrativeInput, data: any, context: AgentContext): Promise<any> {
    const prompt = this.buildNarrativePrompt(input, data);
    const response = await this.llm.complete(prompt, { temperature: 0.3, maxTokens: 4000 });
    
    try {
      return JSON.parse(response.content);
    } catch {
      return { summary: response.content, highlights: [], kpis: [], trends: [], drivers: [], forecast: '', recommendations: [], actions: [] };
    }
  }

  private buildNarrativePrompt(input: NarrativeInput, data: any): string {
    const metricsSummary = Object.entries(data.metrics).map(([k, v]) => 
      `${k}: ${v.length} data points, latest: ${v[v.length-1]?.value ?? 'N/A'}`
    ).join('\n');

    return `
Generate a ${input.type.replace('_', ' ')} for ${input.audience} audience.

CONTEXT:
- Timeframe: ${input.timeframe?.start?.toLocaleDateString()} to ${input.timeframe?.end?.toLocaleDateString()}
- Audience: ${input.audience}
- Key Metrics:\n${metricsSummary}

ANOMALIES DETECTED:
${data.anomalies.map((a: any) => `- ${a.rule_id}: ${a.current_value} vs ${a.threshold_value} (${a.severity})`).join('\n') || 'None'}

FORECASTS:
${Object.entries(data.forecasts).map(([m, f]) => `- ${m}: ${f.predictions?.[0]?.value ?? 'N/A'} next period`).join('\n') || 'None'}

INSIGHTS:
${(data.insights || []).slice(0, 5).map((i: any) => `- ${i.title}: ${i.description}`).join('\n') || 'None'}

Generate structured output with:
{
  "title": "string",
  "executiveSummary": "string",
  "highlights": ["string"],
  "kpis": [{"label": "string", "value": "string", "change": "string", "trend": "up|down|neutral"}],
  "trends": [{"metric": "string", "direction": "up|down|stable", "description": "string"}],
  "drivers": [{"factor": "string", "impact": "string", "evidence": "string"}],
  "forecast": "string",
  "recommendations": ["string"],
  "actions": ["string"],
  "risks": ["string"],
  "initiatives": ["string"],
  "appendix": "string"
}
`;
  }

  private generateSlides(type: string, narrative: any, data: any): Array<{ title: string; content: string; chart?: string }> {
    const templates = this.slideTemplates.get(type) || this.slideTemplates.get('executive_summary') || [];
    
    return templates.map(template => {
      const content = template.content({ ...narrative, ...data });
      return {
        title: template.title,
        content,
        chart: template.layout === 'chart' ? this.generateChartConfig(template.title, data) : undefined,
      };
    });
  }

  private generateChartConfig(title: string, data: any): string {
    // Generate chart.js or vega-lite config
    return JSON.stringify({
      type: 'line',
      data: { labels: [], datasets: [] },
      options: { responsive: true, plugins: { title: { display: true, text: title } } },
    });
  }

  private toMarkdown(slides: any[], narrative: any): string {
    let md = `# ${narrative.title || 'Report'}\n\n`;
    md += `*Generated: ${new Date().toLocaleString()}*\n\n`;
    
    if (narrative.executiveSummary) {
      md += `## Executive Summary\n${narrative.executiveSummary}\n\n`;
    }

    for (const slide of slides) {
      md += `## ${slide.title}\n\n${slide.content}\n\n`;
      if (slide.chart) {
        md += `![Chart](${slide.chart})\n\n`;
      }
    }

    if (narrative.recommendations?.length) {
      md += `## Recommendations\n${narrative.recommendations.map((r: string) => `- ${r}`).join('\n')}\n\n`;
    }

    return md;
  }

  private async toPPTX(slides: any[], narrative: any): Promise<string> {
    // In production, use pptxgenjs
    return 'base64-encoded-pptx';
  }

  private async toPDF(slides: any[], narrative: any): Promise<string> {
    // In production, use puppeteer or pdfkit
    return 'base64-encoded-pdf';
  }

  private async toNotion(slides: any[], narrative: any): Promise<string> {
    // In production, use Notion API
    return 'notion-page-url';
  }
}

interface LLMProvider {
  complete(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<{ content: string; tokensUsed: number }>;
}

function createClient<Database>() {
  return {} as any;
}
