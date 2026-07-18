import { BaseAgent, type AgentContext, type AgentOutput, type LLMProvider } from './base';

class ProphetForecaster {
  async train(data: any[]): Promise<any> { return this; }
  async predict(horizon: number, frequency: string): Promise<any[]> { return []; }
}

class NeuralProphetForecaster {
  async train(data: any[]): Promise<any> { return this; }
  async predict(horizon: number, frequency: string): Promise<any[]> { return []; }
}

class EnsembleForecaster {
  async train(models: any[], data: any[]): Promise<any> { return this; }
  async predict(horizon: number, frequency: string): Promise<any[]> { return []; }
}

interface ForecastInput {
  metric: string;
  dimensions?: Record<string, string>;
  horizon: number;
  frequency: 'day' | 'week' | 'month' | 'quarter';
  scenarios?: Array<{ name: string; assumptions: Record<string, number>; probability: number }>;
  includeComponents?: boolean;
}

interface ForecastOutput extends AgentOutput {
  output: {
    metric: string;
    horizon: number;
    frequency: string;
    predictions: Array<{ timestamp: string; value: number; lower: number; upper: number }>;
    components?: { trend: number[]; yearly: number[]; weekly: number[] };
    scenarios: Array<{ name: string; probability: number; assumptions: Record<string, number>; predictions: Array<{ timestamp: string; value: number; lower: number; upper: number }> }>;
    modelInfo: { algorithm: string; models: string[]; trainingDataPoints: number; trainingPeriod: { start: string; end: string } };
    accuracy: { mape: number; rmse: number; mae: number };
  };
}

export class ForecastAgent extends BaseAgent {
  private prophet: ProphetForecaster;
  private neuralProphet: NeuralProphetForecaster;
  private ensemble: EnsembleForecaster;

  constructor(
    llm: LLMProvider,
    db: any
  ) {
    super(llm, db);
    this.name = 'forecast-agent';
    this.prophet = new ProphetForecaster();
    this.neuralProphet = new NeuralProphetForecaster();
    this.ensemble = new EnsembleForecaster();
  }

  async execute(input: ForecastInput, context: AgentContext): Promise<ForecastOutput> {
    // 1. Fetch historical data
    const data = await this.fetchHistoricalData(input, context);
    
    // 2. Validate data quality
    const quality = this.assessDataQuality(data);
    if (quality.score < 0.5) {
      throw new Error(`Data quality too low for forecasting: ${quality.issues.join(', ')}`);
    }

    // 3. Train models
    const [prophetModel, neuralModel] = await Promise.all([
      this.prophet.train(data),
      this.neuralProphet.train(data),
    ]);

    // 4. Generate base forecast (ensemble)
    const baseForecast = await this.ensemble.predict([prophetModel, neuralModel], input.horizon);

    // 5. Generate scenarios
    const scenarios = await this.generateScenarios(
      input.scenarios || this.getDefaultScenarios(),
      prophetModel,
      input.horizon
    );

    // 5. Calculate accuracy via backtesting
    const accuracy = await this.backtest(prophetModel, data);

    // 6. Generate components if requested
    const components = input.includeComponents
      ? await this.decomposeComponents(prophetModel, input.horizon)
      : undefined;

    return {
      output: {
        metric: input.metric,
        horizon: input.horizon,
        frequency: input.frequency,
        predictions: baseForecast,
        components,
        scenarios,
        modelInfo: {
          algorithm: 'ensemble',
          models: ['prophet', 'neural_prophet'],
          trainingDataPoints: data.length,
          trainingPeriod: { 
            start: data[0]?.ds ?? '', 
            end: data[data.length - 1]?.ds ?? '' 
          },
        },
        accuracy,
      },
      tokensUsed: 0,
      metadata: { dataPoints: data.length, modelsTrained: 2 },
    };
  }

  private async fetchHistoricalData(input: ForecastInput, context: AgentContext): Promise<TimeSeriesPoint[]> {
    // Fetch from metric cache or compute
    const { data, error } = await this.db
      .from('metric_cache')
      .select('dimension_values, value, period_start, period_end')
      .eq('metric_id', input.metric)
      .order('period_start', { ascending: true });

    if (error) throw new Error(`Failed to fetch data: ${error.message}`);

    return (data || []).map(row => ({
      ds: row.period_start,
      y: row.value,
      dimensions: row.dimension_values,
    }));
  }

  private assessDataQuality(data: TimeSeriesPoint[]): { score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 1.0;

    if (data.length < 20) {
      issues.push(`Only ${data.length} data points (minimum 20 recommended)`);
      score *= 0.5;
    }

    // Check for gaps
    const gaps = this.detectGaps(data);
    if (gaps.length > 0) {
      issues.push(`${gaps.length} gaps detected in time series`);
      score *= 0.8;
    }

    // Check for outliers
    const outliers = this.detectOutliers(data);
    if (outliers.length > data.length * 0.1) {
      issues.push(`${outliers.length} outliers detected (>10%)`);
      score *= 0.9;
    }

    // Check for constant values
    const uniqueValues = new Set(data.map(d => d.y)).size;
    if (uniqueValues < 3) {
      issues.push('Very low variance in data');
      score *= 0.5;
    }

    return { score: Math.max(0, score), issues };
  }

  private detectGaps(data: TimeSeriesPoint[]): Array<{ start: string; end: string }> {
    const gaps: Array<{ start: string; end: string }> = [];
    for (let i = 1; i < data.length; i++) {
      const prev = new Date(data[i - 1].ds).getTime();
      const curr = new Date(data[i].ds).getTime();
      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diffDays > 2) {
        gaps.push({ start: data[i - 1].ds, end: data[i].ds });
      }
    }
    return gaps;
  }

  private detectOutliers(data: TimeSeriesPoint[]): number[] {
    const values = data.map(d => d.y);
    const q1 = this.percentile(values, 25);
    const q3 = this.percentile(values, 75);
    const iqr = q3 - q1;
    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;
    return data.filter(d => d.y < lower || d.y > upper).map(d => d.y);
  }

  private percentile(arr: number[], p: number): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.ceil(p / 100 * arr.length) - 1;
    return sorted[Math.max(0, Math.min(arr.length - 1, idx))];
  }

  private async generateScenarios(
    scenarios: ForecastInput['scenarios'],
    model: ProphetModel,
    horizon: number
  ): Promise<ScenarioResult[]> {
    return Promise.all(scenarios.map(async (scenario) => {
      const future = model.makeFutureDataframe(horizon);
      
      // Apply scenario assumptions
      for (const [key, multiplier] of Object.entries(scenario.assumptions)) {
        if (future[key]) {
          future[key] = future[key] * multiplier;
        }
      }

      const forecast = model.predict(future);
      return {
        name: scenario.name,
        probability: scenario.probability,
        assumptions: scenario.assumptions,
        predictions: forecast.map(row => ({
          timestamp: row.ds,
          value: row.yhat,
          lower: row.yhat_lower,
          upper: row.yhat_upper,
        })),
      };
    }));
  }

  private getDefaultScenarios(): ForecastInput['scenarios'] {
    return [
      { name: 'conservative', assumptions: { growth_rate: 0.8, seasonality_strength: 0.9 }, probability: 0.25 },
      { name: 'base', assumptions: {}, probability: 0.5 },
      { name: 'aggressive', assumptions: { growth_rate: 1.2, seasonality_strength: 1.1 }, probability: 0.25 },
    ];
  }

  private async backtest(model: ProphetModel, data: TimeSeriesPoint[]): Promise<AccuracyMetrics> {
    const splitIdx = Math.floor(data.length * 0.8);
    const train = data.slice(0, splitIdx);
    const test = data.slice(splitIdx);

    if (test.length < 3) return { mape: 0, rmse: 0, mae: 0 };

    const trainModel = await this.prophet.train(train);
    const future = trainModel.makeFutureDataframe(test.length);
    const forecast = trainModel.predict(future);

    const predictions = forecast.slice(-test.length).map(r => r.yhat);
    const actuals = test.map(d => d.y);

    const errors = actuals.map((a, i) => Math.abs(a - predictions[i]));
    const mape = errors.reduce((sum, e, i) => sum + (e / Math.abs(test[i].y)), 0) / test.length * 100;
    const rmse = Math.sqrt(errors.reduce((sum, e) => sum + e * e, 0) / test.length);
    const mae = errors.reduce((a, b) => a + b, 0) / test.length;

    return { mape, rmse, mae };
  }

  private async decomposeComponents(model: ProphetModel, horizon: number): Promise<ForecastComponents> {
    const future = model.makeFutureDataframe(horizon);
    const forecast = model.predict(future);
    return {
      trend: forecast.map(r => r.trend),
      yearly: forecast.map(r => r.yearly ?? 0),
      weekly: forecast.map(r => r.weekly ?? 0),
    };
  }

  // Backtest utility
  async backtest(metricId: string, horizon: number, orgId: string): Promise<AccuracyMetrics> {
    const data = await this.fetchHistoricalData({ metric: metricId, horizon, frequency: 'day' }, { orgId, userId: '', permissions: [] });
    const model = await this.prophet.train(data);
    return this.backtest(model, data);
  }
}

// Type definitions
interface TimeSeriesPoint {
  ds: string;
  y: number;
  dimensions?: Record<string, string>;
}

interface ProphetModel {
  train(data: TimeSeriesPoint[]): Promise<ProphetModel>;
  makeFutureDataframe(periods: number): any;
  predict(df: any): Array<{ ds: string; yhat: number; yhat_lower: number; yhat_upper: number; trend?: number; yearly?: number; weekly?: number }>;
}

interface ProphetForecaster {
  train(data: TimeSeriesPoint[]): Promise<ProphetModel>;
}

interface NeuralProphetForecaster {
  train(data: TimeSeriesPoint[]): Promise<any>;
}

interface EnsembleForecaster {
  predict(models: any[], horizon: number): Promise<Array<{ timestamp: string; value: number; lower: number; upper: number }>>;
}

interface ScenarioResult {
  name: string;
  probability: number;
  assumptions: Record<string, number>;
  predictions: Array<{ timestamp: string; value: number; lower: number; upper: number }>;
}

interface AccuracyMetrics {
  mape: number;
  rmse: number;
  mae: number;
}

interface ForecastComponents {
  trend: number[];
  yearly: number[];
  weekly: number[];
}

interface LLMProvider {
  complete(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<{ content: string; tokensUsed: number }>;
}

function createClient<Database>() {
  return {} as any;
}
