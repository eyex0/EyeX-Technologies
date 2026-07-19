from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    Index,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    session_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    org_id: Mapped[str] = mapped_column(String(64), nullable=False, default="default", index=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    agent_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSONB, default=dict)

    __table_args__ = (
        Index("idx_conv_session_created", "session_id", "created_at"),
    )


class LongTermMemory(Base):
    __tablename__ = "long_term_memory"

    session_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    org_id: Mapped[str] = mapped_column(String(64), nullable=False, default="default", index=True)
    key: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    memory_type: Mapped[str] = mapped_column(String(50), nullable=False, default="fact")
    importance: Mapped[float] = mapped_column(Float, default=0.5)
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSONB, default=dict)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("session_id", "key", name="uq_long_term_memory_key"),
        Index("idx_ltm_session_type", "session_id", "memory_type"),
    )


class AgentMemoryRecord(Base):
    __tablename__ = "agent_memory"

    session_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    org_id: Mapped[str] = mapped_column(String(64), nullable=False, default="default", index=True)
    agent_name: Mapped[str] = mapped_column(String(100), nullable=False)
    key: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    memory_type: Mapped[str] = mapped_column(String(50), nullable=False, default="output")
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSONB, default=dict)

    __table_args__ = (
        UniqueConstraint("session_id", "agent_name", "key", name="uq_agent_memory_key"),
        Index("idx_agent_mem_lookup", "session_id", "agent_name"),
    )


class OrganizationKnowledge(Base):
    __tablename__ = "organization_knowledge"

    org_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    key: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String(50), nullable=False, default="manual")
    confidence: Mapped[float] = mapped_column(Float, default=1.0)
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSONB, default=dict)

    __table_args__ = (
        UniqueConstraint("org_id", "category", "key", name="uq_org_knowledge_key"),
        Index("idx_org_knowledge_cat", "org_id", "category"),
    )


class ProactiveAlert(Base):
    __tablename__ = "proactive_alerts"

    org_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    alert_type: Mapped[str] = mapped_column(String(50), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="info")
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    source_agent: Mapped[str] = mapped_column(String(100), nullable=True)
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSONB, default=dict)
    acknowledged: Mapped[bool] = mapped_column(default=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("idx_alerts_org_type", "org_id", "alert_type"),
    )
