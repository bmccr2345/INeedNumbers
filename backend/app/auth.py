from fastapi import Depends, HTTPException, Request
from typing import Optional
import jwt
import os
from motor.motor_asyncio import AsyncIOMotorClient

# Simple user class for dependency injection
class User:
    def __init__(self, id: str, email: str, plan: str = "FREE", **kwargs):
        self.id = id
        self.email = email
        self.plan = plan.upper()
        for k, v in kwargs.items():
            setattr(self, k, v)

async def get_current_user(request: Request) -> User:
    """Extract user from JWT token in httpOnly cookie"""
    token = request.cookies.get('access_token')
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        # Decode JWT
        secret = os.environ.get('JWT_SECRET_KEY')
        if not secret:
            raise HTTPException(status_code=500, detail="JWT secret not configured")
            
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        user_id = payload.get('sub')
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        db = client[os.environ['DB_NAME']]
        
        user_data = await db.users.find_one({"id": user_id})
        if not user_data:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(
            id=user_data.get("id"),
            email=user_data.get("email"),
            plan=user_data.get("plan", "FREE"),
            full_name=user_data.get("full_name")
        )
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_plan(required: str):
    """Plan gating decorator"""
    def dep(user = Depends(get_current_user)):
        allowed = {"PRO"}
        if required.upper() == "STARTER":
            allowed.add("STARTER")
        elif required.upper() == "FREE":
            allowed.update(["STARTER", "FREE"])
            
        if user.plan not in allowed:
            raise HTTPException(status_code=403, detail="Upgrade required")
        return user
    return dep

async def get_current_user_unified(request: Request) -> User:
    """
    Unified authentication that accepts both Bearer tokens and cookies.
    Tries Bearer token first, then falls back to cookie authentication.
    """
    auth_token = None
    
    # Try Bearer token first (from Authorization header)
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        auth_token = auth_header.replace("Bearer ", "")
    else:
        # Fallback to cookie-based authentication  
        auth_token = request.cookies.get('access_token')
    
    if not auth_token:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    try:
        # Decode JWT
        secret = os.environ.get('JWT_SECRET_KEY')
        if not secret:
            raise HTTPException(status_code=500, detail="JWT secret not configured")
            
        payload = jwt.decode(auth_token, secret, algorithms=['HS256'])
        user_id = payload.get('sub')
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        db = client[os.environ['DB_NAME']]
        
        user_data = await db.users.find_one({"id": user_id})
        if not user_data:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(
            id=user_data.get("id"),
            email=user_data.get("email"),
            plan=user_data.get("plan", "FREE"),
            full_name=user_data.get("full_name")
        )
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_plan_unified(required: str):
    """Unified plan gating that works with both auth methods"""
    def dep(user = Depends(get_current_user_unified)):
        allowed = {"PRO"}
        if required.upper() == "STARTER":
            allowed.add("STARTER")
        elif required.upper() == "FREE":
            allowed.update(["STARTER", "FREE"])
            
        if user.plan not in allowed:
            raise HTTPException(status_code=403, detail="Upgrade required")
        return user
    return dep