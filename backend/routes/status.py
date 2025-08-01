from fastapi import APIRouter, HTTPException
from typing import List
from config.database import get_database
from models.schemas import StatusCheck, StatusCheckCreate
import uuid
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/status", tags=["Status"])

@router.post("/", response_model=StatusCheck)
async def create_status_check(status_data: StatusCheckCreate):
    """Create a new status check entry"""
    db = get_database()
    
    try:
        status_id = str(uuid.uuid4())
        
        status_doc = {
            "id": status_id,
            "client_name": status_data.client_name,
            "timestamp": datetime.utcnow()
        }
        
        await db.status_checks.insert_one(status_doc)
        
        logger.info(f"Status check created: {status_data.client_name}")
        
        return StatusCheck(**status_doc)
        
    except Exception as e:
        logger.error(f"Status check creation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la création du statut")

@router.get("/", response_model=List[StatusCheck])
async def get_status_checks():
    """Get all status checks"""
    db = get_database()
    
    try:
        status_cursor = db.status_checks.find().sort("timestamp", -1).limit(100)
        status_checks = await status_cursor.to_list(length=None)
        
        return [StatusCheck(**status) for status in status_checks]
        
    except Exception as e:
        logger.error(f"Get status checks error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des statuts")