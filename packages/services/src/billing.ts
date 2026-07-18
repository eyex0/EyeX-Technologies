import { createClient, type Database } from '../../src/lib/supabase/client';
import Stripe from 'stripe';

const db = createClient<Database>();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const PLANS = {
  free: { priceId: null, seats: 1, aiRuns: 100, sources: 1 },
  pro: { priceId: process.env.STRIPE_PRO_PRICE_ID, seats: 5, aiRuns: 1000, sources: 10 },
  team: { priceId: process.env.STRIPE_TEAM_PRICE_ID, seats: 10, aiRuns: 10000, sources: 50 },
  enterprise: { priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID, seats: 50, aiRuns: 100000, sources: 200 },
};

export class BillingService {
  private db = createClient<Database>();

  async getSubscription(orgId: string): Promise<{
    plan: keyof typeof PLANS;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null> {
    const { data: org } = await db
      .from('organizations')
      .select('plan, stripe_customer_id, stripe_subscription_id, stripe_subscription_status, stripe_current_period_end')
      .eq('id', orgId)
      .single();

    if (!org || !org.stripe_subscription_id) {
      return { plan: 'free', status: 'active', currentPeriodEnd: null, cancelAtPeriodEnd: false };
    }

    const subscription = await stripe.subscriptions.retrieve(org.stripe_subscription_id);
    
    return {
      plan: org.plan as keyof typeof PLANS,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  }

  async createCheckoutSession(orgId: string, plan: 'pro' | 'team' | 'enterprise', successUrl: string, cancelUrl: string): Promise<{ sessionId: string; url: string }> {
    const { data: org } = await db
      .from('organizations')
      .select('stripe_customer_id, name, email')
      .eq('id', orgId)
      .single();

    if (!org) throw new Error('Organization not found');

    let customerId = org.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: org.email,
        name: org.name,
        metadata: { orgId },
      });
      customerId = customer.id;

      await db.from('organizations').update({ stripe_customer_id: customerId }).eq('id', orgId);
    }

    const planConfig = PLANS[plan];
    if (!planConfig.priceId) throw new Error(`Plan ${plan} not configured`);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: planConfig.priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { orgId, plan },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return { sessionId: session.id, url: session.url! };
  }

  async createPortalSession(orgId: string): Promise<{ url: string }> {
    const { data: org } = await db
      .from('organizations')
      .select('stripe_customer_id')
      .eq('id', orgId)
      .single();

    if (!org?.stripe_customer_id) throw new Error('No Stripe customer');

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return { url: session.url };
  }

  async upgrade(orgId: string, plan: 'pro' | 'team' | 'enterprise', paymentMethodId?: string): Promise<void> {
    const { data: org } = await db
      .from('organizations')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', orgId)
      .single();

    if (!org?.stripe_customer_id) throw new Error('No Stripe customer');
    if (!org.stripe_subscription_id) throw new Error('No active subscription');

    const planConfig = PLANS[plan];
    if (!planConfig.priceId) throw new Error(`Plan ${plan} not configured`);

    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: org.stripe_customer_id });
      await stripe.customers.update(org.stripe_customer_id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    const subscription = await stripe.subscriptions.retrieve(org.stripe_subscription_id);
    const itemId = subscription.items.data[0].id;

    await stripe.subscriptions.update(org.stripe_subscription_id, {
      items: [{ id: itemId, price: planConfig.priceId }],
      proration_behavior: 'create_prorations',
    });

    await db.from('organizations').update({ plan }).eq('id', orgId);
  }

  async downgrade(orgId: string, plan: 'free' | 'pro' | 'team'): Promise<void> {
    const { data: org } = await db
      .from('organizations')
      .select('stripe_subscription_id')
      .eq('id', orgId)
      .single();

    if (!org?.stripe_subscription_id) throw new Error('No active subscription');

    const planConfig = PLANS[plan];
    if (!planConfig.priceId && plan !== 'free') throw new Error(`Plan ${plan} not configured`);

    if (plan === 'free') {
      await stripe.subscriptions.cancel(org.stripe_subscription_id);
      await db.from('organizations').update({ plan: 'free', stripe_subscription_id: null }).eq('id', orgId);
    } else {
      const subscription = await stripe.subscriptions.retrieve(org.stripe_subscription_id);
      const itemId = subscription.items.data[0].id;

      await stripe.subscriptions.update(org.stripe_subscription_id, {
        items: [{ id: itemId, price: planConfig.priceId }],
        proration_behavior: 'create_prorations',
      });

      await db.from('organizations').update({ plan }).eq('id', orgId);
    }
  }

  async createPortalSession(orgId: string): Promise<{ url: string }> {
    const { data: org } = await db
      .from('organizations')
      .select('stripe_customer_id')
      .eq('id', orgId)
      .single();

    if (!org?.stripe_customer_id) throw new Error('No Stripe customer');

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return { url: session.url };
  }

  async getUsage(orgId: string, startDate?: Date, endDate?: Date): Promise<{
    aiRuns: number;
    apiCalls: number;
    storageGB: number;
    seats: number;
  }> {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const { data: runs } = await db
      .from('agent_runs')
      .select('tokens_used')
      .eq('organization_id', orgId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    const { data: apiCalls } = await db
      .from('api_usage_logs')
      .select('count')
      .eq('organization_id', orgId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    const { data: org } = await db
      .from('organizations')
      .select('plan, stripe_subscription_id')
      .eq('id', orgId)
      .single();

    return {
      aiRuns: runs?.length || 0,
      apiCalls: apiCalls?.length || 0,
      storageGB: 0, // Would calculate from storage
      seats: org?.plan === 'enterprise' ? 50 : org?.plan === 'team' ? 10 : org?.plan === 'pro' ? 5 : 1,
    };
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.orgId;
        const plan = session.metadata?.plan;

        if (orgId && plan) {
          await db
            .from('organizations')
            .update({ plan, stripe_customer_id: session.customer as string })
            .eq('id', orgId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata?.orgId || 
          (await db.from('organizations').select('id').eq('stripe_customer_id', subscription.customer as string).single())?.data?.id;

        if (orgId) {
          const plan = this.getPlanFromPriceId(subscription.items.data[0]?.price.id);
          await db
            .from('organizations')
            .update({
              plan: plan || 'free',
              stripe_subscription_id: subscription.id,
              stripe_subscription_status: subscription.status,
              stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', orgId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const { data: org } = await db
          .from('organizations')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (org) {
          await db
            .from('organizations')
            .update({ plan: 'free', stripe_subscription_id: null, stripe_subscription_status: 'canceled' })
            .eq('id', org.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Send notification email, update org status
        console.log('Payment failed for invoice:', invoice.id);
        break;
      }
    }
  }

  private getPlanFromPriceId(priceId: string): string | null {
    for (const [plan, config] of Object.entries(PLANS)) {
      if (config.priceId === priceId) return plan;
    }
    return null;
  }
}

export function getBillingService(): BillingService {
  return new BillingService();
}