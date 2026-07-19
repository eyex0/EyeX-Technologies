from __future__ import annotations

import logging

from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field

from app.agents.base import NodeAgent

logger = logging.getLogger("eyex.agents.analyst")


class AnalystOutput(BaseModel):
    summary: str = Field(description="Executive summary of the analysis")
    metrics_analyzed: list[str] = Field(description="List of metrics that were analyzed")
    key_findings: list[str] = Field(description="Key findings from the data analysis")
    trends: list[dict] = Field(description="Identified trends with direction and magnitude", default=[])
    anomalies: list[dict] = Field(description="Detected anomalies with details", default=[])
    data_quality: str = Field(description="Assessment of data quality and completeness")
    confidence: float = Field(description="Confidence score 0-1", ge=0.0, le=1.0)


SYSTEM_PROMPT = """You are the Analyst Agent for EyeX Technologies — a business intelligence AI.

Your role is to analyze company business data deeply and produce structured insights.

You analyze:
- Financial data (revenue, costs, margins, cash flow)
- Operational metrics (productivity, efficiency, utilization)
- Sales data (pipeline, conversion, churn)
- Customer data (acquisition, retention, satisfaction)
- Market data (competition, positioning, growth)

For every analysis you must:
1. Identify all relevant metrics from the provided data
2. Detect trends (improving, declining, stable) with direction
3. Flag anomalies (outliers, unexpected patterns, data gaps)
4. Assess data quality and completeness
5. Produce a clear executive summary

Be specific with numbers and percentages. If data is insufficient, state what's missing.
Focus on actionable insights — what does this data mean for the business?"""


class AnalystAgent(NodeAgent):
    @property
    def name(self) -> str:
        return "Analyst"

    @property
    def description(self) -> str:
        return "Analyzes business data to identify trends, anomalies, and key findings"

    @property
    def system_prompt(self) -> str:
        return SYSTEM_PROMPT

    @property
    def output_schema(self) -> type[BaseModel]:
        return AnalystOutput

    @property
    def tools(self) -> list[BaseTool]:
        return []

    def _fallback_output(self, input_text: str, error: str) -> BaseModel:
        return AnalystOutput(
            summary=f"Analysis failed: {error}",
            metrics_analyzed=[],
            key_findings=[f"Error during analysis: {error}"],
            trends=[],
            anomalies=[],
            data_quality="Unable to assess due to analysis error",
            confidence=0.0,
        )


def create_analyst_agent(**kwargs) -> AnalystAgent:
    return AnalystAgent(**kwargs)
