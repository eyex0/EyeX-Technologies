# EyeX Technologies — Hub71 AI Demo Day Script

**Audience:** Investors, VCs, Hub71 partners, enterprise prospects  
**Duration:** 5 minutes  
**Speaker:** CEO / CTO  
**Demo URL:** `/enterprise-demo`

---

## 0:00 — Hook (15 seconds)

> "Most startups die from silent problems: churn spikes six weeks too late, runway shrinks before the board sees it, and compliance risk becomes a crisis. EyeX is an AI business brain that reads your company data, runs a full executive team of agents, and tells you what to do next — in under 60 seconds."

**Action:** Open the EyeX dashboard and navigate to **Enterprise Demo → NovaPay**.

---

## 0:15 — Scenario (30 seconds)

> "Meet NovaPay, a Series A fintech we invented for this demo. $8.5M raised, 45 people, real-time cross-border payments across 7 markets. We seeded a knowledge graph with its metrics, people, products, competitors, risks, and documents — exactly what a real customer would upload."

**Action:** Point to the scenario card on the left.

- 20+ knowledge-graph nodes
- Vector embeddings of board decks and risk reports
- Realistic fintech metrics

---

## 0:45 — Start the Pipeline (15 seconds)

> "I press one button. EyeX runs five autonomous stages. Let’s watch it live."

**Action:** Click **Start Demo**.

---

## 1:00 — Stage 1: Problem Detection (45 seconds)

> "First, EyeX surfaces the problems. It does not wait for a dashboard. It flags churn at 4.2%, compliance exposure across 7 jurisdictions, and a burn rate of $180K per month with only 14 months of runway. Each problem has a dollar impact attached."

**Action:** Highlight the three problem cards.

> "This is the difference between reactive BI and proactive intelligence."

---

## 1:45 — Stage 2: AI Analysis (30 seconds)

> "Next, the system reads the knowledge graph. It pulls revenue, growth, CAC, LTV, NRR, and compares them to the stored context. It does not hallucinate — every number is grounded in the data the company uploaded."

**Action:** Point to the metric grid and the retrieved context snippet.

---

## 2:15 — Stage 3: Executive Team (90 seconds)

> "Now the real magic. EyeX runs four specialized executive agents in parallel: CEO, CFO, COO, and Risk. Each reasons from its own perspective."

**Action:** Walk through the four executive cards.

- **CEO:** strategic vision and fundraising narrative
- **CFO:** runway, burn, and retention economics
- **COO:** operational efficiency and scaling bottlenecks
- **Risk:** risk score, compliance, and concentration

> "In a real board meeting this takes a week of prep and four senior executives. EyeX does it in seconds, and every conclusion is traceable."

---

## 3:45 — Stage 4: Recommendations (45 seconds)

> "Problems identified. Analysis done. Executives heard. Now EyeX recommends action: launch a churn-reduction program, centralize compliance monitoring, and expand the white-label offering in Saudi Arabia and Qatar. Each recommendation is prioritized by severity and business impact."

**Action:** Highlight the recommendation list.

---

## 4:30 — Stage 5: Business Impact (30 seconds)

> "Finally, EyeX quantifies value. For this demo: problems detected, recommendations generated, hours of manual analysis saved, and an overall impact score. This is what a CFO wants to see before buying."

**Action:** Point to the impact metrics.

---

## 5:00 — Close (15 seconds)

> "EyeX turns raw company data into board-ready intelligence in real time. No data team required, no week-long analysis, no black-box answers. We are live, self-serve, and ready for pilot customers. Thank you — let’s talk."

**Action:** Pause on the final impact screen. Offer QR code / landing page if available.

---

## Backup Plan

If the LLM latency is high or the network is slow, the demo falls back to deterministic data on the backend. The screen still renders a complete, compelling narrative.

## Demo Checklist

- [ ] Backend is deployed and `VITE_PYTHON_BACKEND_URL` is set.
- [ ] OpenAI API key is active or fallback data is enabled.
- [ ] Demo user has a valid Supabase session for auth.
- [ ] Browser cache is cleared before going on stage.
- [ ] Test one full run within 5 minutes of showtime.
