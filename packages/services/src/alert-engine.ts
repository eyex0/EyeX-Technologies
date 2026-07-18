import { createClient, type Database } from '../../src/lib/supabase/client';
import { Resend } from 'resend';
import { WebClient } from '@slack/web-api';

const db = createClient<Database>();

interface AlertCondition {
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'change_pct';
  threshold: number;
  window: string; // '5m', '1h', '1d'
  aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count' | 'last';
}

interface AlertEvaluation {
  frequency: string; // '1m', '5m', '15m'
  lookback: string;  // '5m', '15m', '1h'
}

export class AlertEngine {
  private db = createClient<Database>();
  private resend = new Resend(process.env.RESEND_API_KEY);
  private slack = new WebClient(process.env.SLACK_BOT_TOKEN);
  private running = false;
  private interval: NodeJS.Timeout | null = null;

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;
    this.interval = setInterval(() => this.evaluateRules(), 60_000); // Every minute
    console.log('[AlertEngine] Started');
  }

  async stop(): Promise<void> {
    this.running = false;
    if (this.interval) clearInterval(this.interval);
    console.log('[AlertEngine] Stopped');
  }

  async evaluateRules(): Promise<void> {
    try {
      const { data: rules } = await db
        .from('alert_rules')
        .select('*')
        .eq('enabled', true)
        .or(`schedule->>type.eq.continuous,schedule->>cron.not.is.null`);

      if (!rules?.length) return;

      for (const rule of rules) {
        await this.evaluateRule(rule);
      }
    } catch (error) {
      console.error('[AlertEngine] Evaluation error:', error);
    }
  }

  private async evaluateRule(rule: any): Promise<void> {
    const { condition, evaluation, anomaly_config } = rule;

    // Build query based on metric
    const metricId = rule.metric_id;
    if (!metricId) return;

    const metric = await this.getMetric(metricId);
    if (!metric) return;

    // Execute metric query for recent window
    const windowMs = this.parseWindow(evaluation.lookback || '5m');
    const startTime = new Date(Date.now() - windowMs).toISOString();

    const { data: points, error } = await this.db
      .from('metric_cache')
      .select('value, period_start')
      .eq('metric_id', metricId)
      .gte('period_start', startTime)
      .order('period_start');

    if (error || !points?.length) return;

    const values = points.map(p => p.value);
    const current = this.aggregate(values, condition.aggregation);
    const threshold = condition.threshold;
    const operator = condition.operator;

    let triggered = this.evaluateCondition(current, threshold, operator);

    // Check anomaly config
    if (anomaly_config?.enabled) {
      const anomalyTriggered = await this.checkAnomaly(metric, anomaly_config);
      triggered = triggered || anomalyTriggered;
    }

    if (triggered) {
      await this.fireAlert(rule, current, threshold);
    } else {
      // Check if we should resolve existing incidents
      await this.checkResolution(rule);
    }
  }

  private evaluateCondition(current: number, threshold: number, operator: string): boolean {
    switch (operator) {
      case '>': return current > threshold;
      case '<': return current < threshold;
      case '>=': return current >= threshold;
      case '<=': return current <= threshold;
      case '==': return current === threshold;
      case '!=': return current !== threshold;
      case 'change_pct': {
        // Would need previous period comparison
        return false;
      }
      default: return false;
    }
  }

  private aggregate(values: number[], method: string): number {
    if (!values.length) return 0;
    switch (method) {
      case 'avg': return values.reduce((a, b) => a + b, 0) / values.length;
      case 'sum': return values.reduce((a, b) => a + b, 0);
      case 'min': return Math.min(...values);
      case 'max': return Math.max(...values);
      case 'count': return values.length;
      case 'last': return values[values.length - 1];
      default: return values[values.length - 1];
    }
  }

  private async checkAnomaly(metricId: string, config: any): Promise<boolean> {
    // Simplified - in production would use statistical detection
    return false;
  }

  private async fireAlert(rule: any, current: number, threshold: number): Promise<void> {
    // Check if incident already firing
    const { data: existing } = await db
      .from('alert_incidents')
      .select('id')
      .eq('rule_id', rule.id)
      .eq('status', 'firing')
      .single();

    if (existing) return; // Already firing

    // Create incident
    const { data: incident, error } = await db
      .from('alert_incidents')
      .insert({
        rule_id: rule.id,
        organization_id: rule.organization_id,
        status: 'firing',
        severity: rule.severity,
        current_value: current,
        threshold_value: threshold,
        deviation_pct: threshold !== 0 ? ((current - threshold) / Math.abs(threshold)) * 100 : 0,
        dimensions: rule.condition.dimensions || {},
        context: { rule_name: rule.name, threshold, current },
      })
      .select()
      .single();

    if (error || !incident) {
      console.error('[AlertEngine] Failed to create incident:', error);
      return;
    }

    // Send notifications
    await this.sendNotifications(rule, incident);

    // Update next escalation
    await this.scheduleEscalation(incident.id, rule);
  }

  private async sendNotifications(rule: any, incident: any): Promise<void> {
    const message = this.formatMessage(rule, incident);

    for (const channel of rule.channels) {
      try {
        switch (channel.type) {
          case 'slack':
            await this.sendSlack(channel.config, message, incident.severity);
            break;
          case 'email':
            await this.sendEmail(channel.config, message, incident);
            break;
          case 'webhook':
            await this.sendWebhook(channel.config, incident);
            break;
          case 'pagerduty':
            await this.sendPagerDuty(channel.config, incident);
            break;
          case 'teams':
            await this.sendTeams(channel.config, message);
            break;
        }

        await db
          .from('alert_notifications')
          .insert({
            incident_id: incident.id,
            channel_type: channel.type,
            channel_config: channel.config,
            status: 'sent',
            sent_at: new Date().toISOString(),
          });
      } catch (error) {
        console.error(`[AlertEngine] Failed to send ${channel.type}:`, error);
        await db
          .from('alert_notifications')
          .insert({
            incident_id: incident.id,
            channel_type: channel.type,
            channel_config: channel.config,
            status: 'failed',
            error_message: error.message,
            created_at: new Date().toISOString(),
          });
      }
    }
  }

  private formatMessage(rule: any, incident: any): string {
    return `
🚨 *${rule.name}* (${incident.severity.toUpperCase()})
Current: ${incident.current_value}
Threshold: ${incident.threshold_value}
Deviation: ${incident.deviation_pct?.toFixed(1)}%
Time: ${new Date().toISOString()}
    `.trim();
  }

  private async sendSlack(config: any, message: string, severity: string): Promise<void> {
    const color = severity === 'critical' ? '#ff0000' : severity === 'warning' ? '#ffaa00' : '#36a64f';
    await this.slack.chat.postMessage({
      channel: config.channel,
      text: message,
      attachments: [{ color, text: message }],
    });
  }

  private async sendEmail(config: any, message: string, incident: any): Promise<void> {
    await this.resend.emails.send({
      from: 'alerts@eyex.ai',
      to: config.to,
      subject: `[${incident.severity.toUpperCase()}] ${incident.rule_name}`,
      html: `<pre>${message}</pre>`,
    });
  }

  private async sendWebhook(config: any, incident: any): Promise<void> {
    await fetch(config.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...config.headers },
      body: JSON.stringify(incident),
    });
  }

  private async sendPagerDuty(config: any, incident: any): Promise<void> {
    // Implementation would use PagerDuty Events API
  }

  private async sendTeams(config: any, message: string): Promise<void> {
    // Implementation would use Teams webhook
  }

  private async checkResolution(rule: any): Promise<void> {
    const { data: firing } = await db
      .from('alert_incidents')
      .select('id')
      .eq('rule_id', rule.id)
      .eq('status', 'firing');

    for (const incident of firing || []) {
      // Re-evaluate condition
      // If no longer triggered, resolve
    }
  }

  private async scheduleEscalation(incidentId: string, rule: any): Promise<void> {
    // Schedule escalation checks based on rule configuration
  }

  private parseWindow(window: string): number {
    const match = window.match(/^(\d+)([mhd])$/);
    if (!match) return 5 * 60 * 1000;
    const value = parseInt(match[1]);
    const unit = match[2];
    return value * ({ m: 60_000, h: 3_600_000, d: 86_400_000 }[unit] || 60_000);
  }

  private async getMetric(id: string): Promise<any> {
    const { data } = await db.from('metrics').select('*').eq('id', id).single();
    return data;
  }
}

export function getAlertEngine(): AlertEngine {
  return new AlertEngine();
}