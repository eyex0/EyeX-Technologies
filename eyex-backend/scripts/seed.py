from __future__ import annotations

import asyncio
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.database import async_session_factory
from app.models.organization import Organization, OrganizationMember
from app.models.user import User
from app.models.workspace import AgentConfig, SubscriptionPlan, Workspace, WorkspaceMember


async def seed() -> None:
    async with async_session_factory() as session:
        existing = await session.execute(select(User).where(User.email == "admin@eyex.tech"))
        if existing.scalar_one_or_none():
            print("Database already seeded.")
            return

        admin = User(
            id=uuid.uuid4(),
            email="admin@eyex.tech",
            hashed_password=hash_password("admin123"),
            full_name="Admin User",
            is_superuser=True,
        )
        session.add(admin)
        await session.flush()

        org = Organization(
            id=uuid.uuid4(),
            name="EyeX Technologies",
            slug="eyex-technologies",
            description="The foundational AI infrastructure company",
            owner_id=admin.id,
        )
        session.add(org)
        await session.flush()

        member = OrganizationMember(
            organization_id=org.id,
            user_id=admin.id,
            role="owner",
        )
        session.add(member)

        ws = Workspace(
            organization_id=org.id,
            name="Default Workspace",
            slug="default",
            description="Default workspace for all agents and tasks",
            is_default=True,
        )
        session.add(ws)
        await session.flush()

        wm = WorkspaceMember(
            workspace_id=ws.id,
            user_id=admin.id,
            role="admin",
        )
        session.add(wm)

        agent_roles = [
            ("supervisor", "Supervisor"),
            ("planner", "Planner"),
            ("researcher", "Researcher"),
            ("coder", "Coder"),
            ("reviewer", "Reviewer"),
            ("tester", "Tester"),
            ("documenter", "Documenter"),
            ("devops", "DevOps"),
        ]
        for role, display in agent_roles:
            cfg = AgentConfig(
                workspace_id=ws.id,
                agent_role=role,
                display_name=display,
                is_enabled=True,
            )
            session.add(cfg)

        plans = [
            SubscriptionPlan(
                name="Free",
                slug="free",
                description="For individuals getting started",
                price_monthly=0,
                price_yearly=0,
                max_users=1,
                max_agents=3,
                max_tasks_per_month=100,
                features={
                    "chat": True,
                    "agents": True,
                    "memory": True,
                    "api_access": False,
                    "priority_support": False,
                    "custom_models": False,
                },
                sort_order=0,
            ),
            SubscriptionPlan(
                name="Starter",
                slug="starter",
                description="For small teams",
                price_monthly=29,
                price_yearly=290,
                max_users=5,
                max_agents=8,
                max_tasks_per_month=5000,
                features={
                    "chat": True,
                    "agents": True,
                    "memory": True,
                    "api_access": True,
                    "priority_support": False,
                    "custom_models": False,
                },
                sort_order=1,
            ),
            SubscriptionPlan(
                name="Professional",
                slug="professional",
                description="For growing businesses",
                price_monthly=99,
                price_yearly=990,
                max_users=20,
                max_agents=20,
                max_tasks_per_month=50000,
                features={
                    "chat": True,
                    "agents": True,
                    "memory": True,
                    "api_access": True,
                    "priority_support": True,
                    "custom_models": False,
                },
                sort_order=2,
            ),
            SubscriptionPlan(
                name="Enterprise",
                slug="enterprise",
                description="For large organizations",
                price_monthly=499,
                price_yearly=4990,
                max_users=999,
                max_agents=999,
                max_tasks_per_month=999999,
                features={
                    "chat": True,
                    "agents": True,
                    "memory": True,
                    "api_access": True,
                    "priority_support": True,
                    "custom_models": True,
                    "dedicated_infrastructure": True,
                    "sso": True,
                    "audit_logs": True,
                },
                sort_order=3,
            ),
        ]
        for plan in plans:
            session.add(plan)

        await session.commit()

    print("Database seeded successfully.")
    print("Admin email: admin@eyex.tech")
    print("Admin password: admin123")
    print("Default workspace created with 8 agents enabled")
    print("4 subscription plans created (Free, Starter, Professional, Enterprise)")


if __name__ == "__main__":
    asyncio.run(seed())
