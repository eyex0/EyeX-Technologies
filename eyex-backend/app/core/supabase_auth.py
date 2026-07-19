from __future__ import annotations

import logging
from typing import Any

from jose import JWTError, jwt

from app.config import get_settings

logger = logging.getLogger("eyex.core.supabase_auth")


def decode_supabase_token(token: str) -> dict[str, Any]:
    """Decode and validate a Supabase JWT using the project's JWT secret.

    Returns a dict with user metadata on success, or {"error": "..."} on failure.
    """
    settings = get_settings()
    if not settings.supabase_jwt_secret:
        return {"error": "missing_config"}

    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "expired"}
    except JWTError as exc:
        logger.debug("Supabase token decode failed: %s", exc)
        return {"error": "invalid"}


def is_supabase_token(token: str) -> bool:
    """Heuristic to detect a Supabase-issued JWT.

    Supabase tokens are HS256 and contain a recognizable issuer/ reference claim.
    """
    try:
        unverified = jwt.get_unverified_claims(token)
        return bool(
            unverified.get("iss") == "supabase"
            or unverified.get("role") == "anon"
            or unverified.get("role") == "authenticated"
        )
    except Exception:
        return False


def extract_user_id(payload: dict[str, Any]) -> str | None:
    """Extract the user identifier from a Supabase JWT payload."""
    return payload.get("sub")


def extract_user_email(payload: dict[str, Any]) -> str | None:
    """Extract the user email from a Supabase JWT payload."""
    return payload.get("email")
