import { BaseAgent, type AgentContext, type AgentOutput } from './base';

interface PreMortemInput {
  scenario: string;
  metrics?: string[];
  timeframe?: { start: Date; end: Date };
}

interface PreMortemOutput extends AgentOutput {
  output: {
    risks: Array<{
      id: string;
      title: string;
      description: string;
      probability: number;
      impact: 'low' | 'medium' | 'high' | 'critical';
      category: 'technical' | 'operational' | 'market' | 'regulatory' | 'team';
      leadingIndicators: string[];
      mitigation: string[];
      owner: string;
      timeline: string;
    }>;
    summary: string;
    riskMatrix: { high: number; medium: number; low: number };
    recommendations: string[];
  };
}

export class PreMortemAgent extends BaseAgent {
  constructor(llm: LLMProvider, db: ReturnType<typeof createClient<Database>>) {
    super(llm, db);
  }

  async execute(input: PreMortemInput, context: AgentContext): Promise<PreMortemOutput> {
    const { scenario, metrics, timeframe } = input;

    // 1. Analyze historical patterns for similar scenarios
    const historical = await this.analyzeHistorical(scenario, context);

    // 2. Run scenario simulation
    const simulation = await this.runSimulation(scenario, metrics, timeframe, context);

    // 3. Identify risks using LLM
    const risks = await this.identifyRisks(scenario, historical, simulation, context);

    // 4. Build risk matrix
    const riskMatrix = this.buildRiskMatrix(risks);

    // 5. Generate summary and recommendations
    const summary = this.generateSummary(risks);
    const recommendations = this.generateRecommendations(risks);

    return {
      output: {
        risks,
        summary,
        riskMatrix,
        recommendations,
      },
      tokensUsed: 0,
      metadata: { scenario, riskCount: risks.length },
    };
  }

  private async analyzeHistorical(scenario: string, context: AgentContext): Promise<any> {
    // Query past similar scenarios
    const { data } = await this.db
      .from('agent_runs')
      .select('input, output')
      .eq('organization_id', context.orgId)
      .eq('agent_type', 'pre_mortem')
      .eq('status', 'completed')
      .ilike('input->>scenario', `%${scenario.split(' ')[0]}%`)
      .limit(10);

    return data || [];
  }

  private async runSimulation(scenario: string, metrics: string[] | undefined, timeframe: { start: Date; end: Date } | undefined, context: AgentContext): Promise<any> {
    // In production, would run Monte Carlo or agent-based simulation
    // For now, return structured risk factors
    return {
      marketFactors: ['competition', 'seasonality', 'economic_conditions'],
      internalFactors: ['team_capacity', 'technical_debt', 'budget'],
      timelineRisks: ['dependency_delays', 'scope_creep', 'resource_conflicts'],
      probabilityDistribution: {
        success: 0.45,
        partial_success: 0.35,
        significant_issues: 0.15,
        failure: 0.05,
      },
    };
  }

  private async identifyRisks(scenario: string, historical: any, simulation: any, context: AgentContext): Promise<any[]> {
    const prompt = `
Analyze this scenario and identify specific risks:

SCENARIO: ${scenario}

HISTORICAL DATA:
${JSON.stringify(historical.slice(0, 3), null, 2)}

SIMULATION RESULTS:
${JSON.stringify(simulation, null, 2)}

Identify 8-12 specific risks across categories: technical, operational, market, regulatory, team.
For each risk, provide:
- title, description
- probability (0-1)
- impact (low/medium/high/critical)
- category
- leading indicators (3-5 specific metrics to watch)
- mitigation strategies (3-5 actionable items)
- suggested owner (role)
- timeline for mitigation

Return JSON array.
`;

    const response = await this.llm.complete(prompt, { temperature: 0.3, maxTokens: 4000 });
    try {
      return JSON.parse(response.content);
    } catch {
      return this.getDefaultRisks(scenario);
    }
  }

  private getDefaultRisks(scenario: string): any[] {
    return [
      {
        id: crypto.randomUUID(),
        title: 'Timeline Slippage',
        description: 'Project milestones may slip due to underestimated complexity',
        probability: 0.65,
        impact: 'high',
        category: 'operational',
        leadingIndicators: ['milestone_delays', 'scope_changes', 'resource_availability'],
        mitigation: ['Weekly milestone reviews', 'Buffer time in schedule', 'Early escalation process'],
        owner: 'Project Manager',
        timeline: 'Ongoing',
      },
      {
        id: crypto.randomUUID(),
        title: 'Technical Debt Accumulation',
        description: 'Rushed implementation creates maintenance burden',
        probability: 0.55,
        impact: 'medium',
        category: 'technical',
        leadingIndicators: ['code_review_skip_rate', 'test_coverage_decline', 'hotfix_frequency'],
        mitigation: ['Enforce code review gates', 'Automated quality gates', 'Dedicated refactoring sprints'],
        owner: 'Tech Lead',
        timeline: 'Monthly review',
      },
      {
        id: crypto.randomUUID(),
        title: 'Resource Constraints',
        description: 'Key personnel unavailable during critical phases',
        probability: 0.45,
        impact: 'high',
        category: 'team',
        leadingIndicators: ['pto_requests', 'hiring_pipeline', 'knowledge_silos'],
        mitigation: ['Cross-training program', 'Documentation standards', 'Contractor backup'],
        owner: 'Engineering Manager',
        timeline: 'Before sprint planning',
      },
    ];
  }

  private buildRiskMatrix(risks: any[]): { high: number; medium: number; low: number } {
    return {
      high: risks.filter(r => r.impact === 'critical' || (r.impact === 'high' && r.probability > 0.5)).length,
      medium: risks.filter(r => r.impact === 'high' && r.probability <= 0.5 || r.impact === 'medium' && r.probability > 0.3).length,
      low: risks.filter(r => r.impact === 'low' || (r.impact === 'medium' && r.probability <= 0.3)).length,
    };
  }

  private generateSummary(risks: any[]): string {
    const critical = risks.filter(r => r.impact === 'critical').length;
    const high = risks.filter(r => r.impact === 'high').length;
    const total = risks.length;
    
    return `Pre-mortem analysis identified ${total} risks: ${critical} critical, ${high} high impact. ` +
           `Top risk: ${risks[0]?.title ?? 'Unknown'}. ` +
           `Estimated success probability: ${Math.round((1 - risks.reduce((sum, r) => sum + r.probability * (r.impact === 'critical' ? 0.8 : r.impact === 'high' ? 0.5 : 0.2), 0) / total) * 100)}%.`;
  }

  private generateRecommendations(risks: any[]): string[] {
    const topRisks = risks.filter(r => r.impact === 'critical' || r.impact === 'high').slice(0, 5);
    return topRisks.map(r => 
      `[${r.impact.toUpperCase()}] ${r.mitigation[0]} (Owner: ${r.owner}, Timeline: ${r.timeline})`
    );
  }
}

interface LLMProvider {
  complete(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<{ content: string; tokensUsed: number }>;
}

function createClient<Database>() {
  return {} as any;
}
