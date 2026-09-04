import os
import httpx
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class GoogleTokenRequest(BaseModel):
    id_token: str

@router.post("/google/verify")
async def verify_google_token(req: GoogleTokenRequest):
    """
    Verifies a Google OAuth ID token with Google's tokeninfo endpoint.
    """
    client_id = os.getenv("GOOGLE_CLIENT_ID", "")
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={req.id_token}")
        if res.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid Google OAuth token.")
        data = res.json()
        
        # Verify audience matches client ID if provided
        if client_id and data.get("aud") != client_id:
            raise HTTPException(status_code=400, detail="Token audience does not match configured Client ID.")
            
        return {
            "status": "authenticated",
            "name": data.get("name"),
            "email": data.get("email"),
            "picture": data.get("picture"),
            "google_id": data.get("sub")
        }
