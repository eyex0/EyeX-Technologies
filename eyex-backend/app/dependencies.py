from __future__ import annotations

from fastapi import Depends, Header, HTTPException

from app.core.security import decode_token
from app.database import async_session_factory
from app.models.user import User


async def get_token_from_header(authorization: str = Header(..., alias="Authorization")) -> str:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return token


async def get_current_user(token: str = Depends(get_token_from_header)) -> User:
    payload = decode_token(token)
    err = payload.get("error")
    if err == "expired":
        from app.core.exceptions import UnauthorizedException
        raise UnauthorizedException("Token has expired")
    if err == "invalid":
        from app.core.exceptions import UnauthorizedException
        raise UnauthorizedException("Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        from app.core.exceptions import UnauthorizedException

        raise UnauthorizedException("Invalid token")

    async with async_session_factory() as session:
        user = await session.get(User, user_id)
        if not user:
            raise UnauthorizedException("User not found")
        return user
