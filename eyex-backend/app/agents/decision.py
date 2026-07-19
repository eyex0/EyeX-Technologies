from __future__ import annotations

import logging

from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field

from app.agents.base import NodeAgent

logger = logging.getLogger("eyex.agents.decision")


class DecisionOutput(BaseModel):
    executive_summary: str = Field(description="Single-page executive summary for decision-makers")
    situation: str = Field(description="Current situation overview")
    key_insights: list[str] = Field(description="Top 3-5 insights decision-makers must know")
    recommended_decisions: list[dict] = Field(description="Specific decisions with options and trade-offs", default=[])
    expected_outcomes: list[dict] = Field(description="Expected outcomes of recommended decisions", default=[])
    metrics_projections: list[dict] = Field(description="Projected metric improvements from decisions", default=[])
    risk_analysis: str = Field(description="Risk assessment for recommended path")
    reasoning_chain: list[str] = Field(description="Step-by-step reasoning that led to these conclusions")
    next_steps: list[str] = Field(description="Immediate next steps for the organization")
    confidence: float = Field(description="Overall confidence score 0-1", ge=0.0, le=1.0)


SYSTEM_PROMPT = """You are the Decision Agent for EyeX Technologies — the final synthesis AI.

Your role is to transform analysis and strategy into clear, decision-ready output for executives.

You take the Analyst's findings and Strategist's recommendations and produce:

1. **Executive Summary** — One-page summary for CEO/board level
2. **Situation Overview** — What is happening right now
3. **Key Insights** — The 3-5 things decision-makers MUST know
4. **Recommended Decisions** — Specific decisions with options and trade-offs
5. **Expected Outcomes** — What will happen if decisions are followed
6. **Metrics Projections** — Quantified projected improvements
7. **Risk Analysis** — What could go wrong
8. **Reasoning Chain** — Transparent step-by-step reasoning
9. **Next Steps** — Immediate actions for the organization

Format output for executive consumption. Be clear, concise, and decisive.
Every claim must trace back to specific data or analysis.
Include confidence levels for each recommendation.

Your output IS the final deliverable — make it boardroom-ready."""


class DecisionAgent(NodeAgent):
    @property
    def name(self) -> str:
        return "Decision"

    @property
    def description(self) -> str:
        return "Synthesizes analysis and strategy into executive-ready decisions"

    @property
    def system_prompt(self) -> str:
        return SYSTEM_PROMPT

    @property
    def output_schema(self) -> type[BaseModel]:
        return DecisionOutput

    @property
    def tools(self) -> list[BaseTool]:
        return []

    def _fallback_output(self, input_text: str, error: str) -> BaseModel:
        return DecisionOutput(
            executive_summary=f"Decision synthesis failed: {error}",
            situation="Unable to assess",
            key_insights=[f"Error during synthesis: {error}"],
            recommended_decisions=[],
            expected_outcomes=[],
            metrics_projections=[],
            risk_analysis="Unable to assess due to error",
            reasoning_chain=[f"Pipeline failed at decision stage: {error}"],
            next_steps=["Review pipeline logs and retry"],
            confidence=0.0,
        )


def create_decision_agent(**kwargs) -> DecisionAgent:
    return DecisionAgent(**kwargs)
