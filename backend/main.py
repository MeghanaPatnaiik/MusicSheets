"""
main.py — FastAPI application with auth routes.

Routes:
  POST /auth/register  — create a new user
  POST /auth/login     — verify credentials, set JWT httpOnly cookie
  POST /auth/logout    — clear the cookie
  GET  /auth/me        — return current user from cookie
"""
import os
from datetime import datetime
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from sqlalchemy.orm import Session

from auth import (
    COOKIE_NAME,
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from database import Base, engine, get_db
from models import User

from api.upload import router as upload_router

# ---------------------------------------------------------------------------
# Create tables on startup
# ---------------------------------------------------------------------------
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(title="MusicSheets API", version="0.1.0")

def is_production() -> bool:
    return os.getenv("ENVIRONMENT", "").lower() == "production" or os.getenv("RENDER", "").lower() == "true"

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://musicsheets-frontend.onrender.com",
]
if allowed_origins_env:
    for o in allowed_origins_env.split(","):
        stripped = o.strip()
        if stripped and stripped not in origins:
            origins.append(stripped)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")



# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

# Allowed email domains — only well-known providers accepted
_ALLOWED_DOMAINS = {
    "gmail.com", "googlemail.com",
    "outlook.com", "hotmail.com", "live.com", "msn.com",
    "yahoo.com", "yahoo.co.in", "yahoo.co.uk", "ymail.com",
    "icloud.com", "me.com", "mac.com",
    "protonmail.com", "protonmail.ch", "pm.me",
    "zoho.com",
    "aol.com",
    "mail.com",
    "gmx.com", "gmx.net",
    "rediffmail.com",
    "in.com",
}


def _check_domain(v: str) -> str:
    v = v.strip().lower()
    domain = v.split("@")[-1] if "@" in v else ""
    if domain not in _ALLOWED_DOMAINS:
        raise ValueError(
            "Please use a valid email provider "
            "(Gmail, Outlook, Yahoo, iCloud, ProtonMail, etc.)."
        )
    return v


class RegisterRequest(BaseModel):
    email: EmailStr
    name: str
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def email_must_be_valid(cls, v: str) -> str:
        return _check_domain(v)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def email_must_be_valid(cls, v: str) -> str:
        return _check_domain(v)


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )

    user = User(
        email=body.email,
        name=body.name,
        hashed_password=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=UserResponse)
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token({"sub": str(user.id)})
    prod = is_production()
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="none" if prod else "lax",
        secure=True if prod else False,
        path="/",
        max_age=60 * 60,  # 1 hour
    )
    return user


@app.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    prod = is_production()
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        samesite="none" if prod else "lax",
        secure=True if prod else False,
    )


@app.get("/auth/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
