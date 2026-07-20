from __future__ import annotations

import logging
from collections.abc import AsyncGenerator
from uuid import UUID

from fastapi import Depends, Header, HTTPException

from app.core.context import org_id_ctx
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_token
from app.core.supabase_auth import decode_supabase_token, is_supabase_token
from app.database import async_session_factory
from app.models.user import User

logger = logging.getLogger("eyex.dependencies")


async def get_token_from_header(authorization: str = Header(..., alias="Authorization")) -> str:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return token


def _raise_auth_error(error: str) -> None:
    if error == "expired":
        raise UnauthorizedException("Token has expired")
    raise UnauthorizedException("Invalid token")


async def _resolve_user_from_payload(payload: dict) -> User:
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token")

    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise UnauthorizedException("Invalid token")

    async with async_session_factory() as session:
        user = await session.get(User, user_uuid)
        if not user:
            logger.warning("Authenticated user %s not found in backend database", user_id)
            raise UnauthorizedException("User not found")
        return user


async def get_current_user(token: str = Depends(get_token_from_header)) -> User:
    """Authenticate via backend JWT or Supabase JWT.

    Supports the existing backend JWT tokens for direct API usage and
    Supabase access tokens sent by the frontend.
    """
    if is_supabase_token(token):
        payload = decode_supabase_token(token)
        err = payload.get("error")
        if err:
            _raise_auth_error(err)
        return await _resolve_user_from_payload(payload)

    payload = decode_token(token)
    err = payload.get("error")
    if err:
        _raise_auth_error(err)
    return await _resolve_user_from_payload(payload)


async def get_current_user_optional(
    authorization: str | None = Header(None, alias="Authorization"),
) -> User | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    try:
        return await get_current_user(token)
    except Exception:
        return None


def require_admin() -> Depends:
    """Dependency factory for endpoints restricted to superusers."""
    async def _require_admin(user: User = Depends(get_current_user)) -> User:
        if not user.is_superuser:
            from app.core.exceptions import ForbiddenException
            raise ForbiddenException("Admin access required")
        return user
    return Depends(_require_admin)


def require_active_user() -> Depends:
    """Dependency factory for endpoints restricted to active users."""
    async def _require_active(user: User = Depends(get_current_user)) -> User:
        if not user.is_active:
            raise UnauthorizedException("Account is disabled")
        return user
    return Depends(_require_active)


async def get_current_org_id(
    user: User = Depends(get_current_user),
    x_org_id: str | None = Header(None, alias="X-Organization-Id"),
) -> AsyncGenerator[str, None]:
    """Resolve the current organization/workspace for the authenticated user.

    Uses the X-Organization-Id header when provided and the user is a member,
    otherwise falls back to the user's first organization, then 'default'.
    Sets a context variable so downstream services can read the org id without
    threading it through every call.
    """
    org_id: str | None = None
    user_org_ids = {str(m.organization_id) for m in user.organizations}

    if x_org_id:
        if x_org_id in user_org_ids:
            org_id = x_org_id
        else:
            raise ForbiddenException("User is not a member of this organization")
    elif user_org_ids:
        org_id = next(iter(user_org_ids))
    else:
        org_id = "default"

    token = org_id_ctx.set(org_id)
    try:
        yield org_id
    finally:
        org_id_ctx.reset(token)
