from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from config.database import get_database
from services.auth_service import verify_token
from services.llm_service import call_ai_with_file_context
import os
import uuid
from datetime import datetime
import aiofiles

router = APIRouter(prefix="/files", tags=["files"])
security = HTTPBearer()

# Dossier pour stocker les fichiers uploadés
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Types de fichiers autorisés
ALLOWED_EXTENSIONS = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.json': 'application/json',
    '.xml': 'text/xml',
    '.md': 'text/markdown'
}

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    token: str = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Upload un fichier"""
    try:
        # Vérifier le token
        payload = verify_token(token.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Token invalide")
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token invalide")
        
        # Vérifier l'extension du fichier
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Type de fichier non supporté. Extensions autorisées: {', '.join(ALLOWED_EXTENSIONS.keys())}"
            )
        
        # Générer un nom de fichier unique
        file_id = str(uuid.uuid4())
        filename = f"{file_id}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Sauvegarder le fichier
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Enregistrer les métadonnées en base
        file_doc = {
            "id": file_id,
            "file_id": file_id,  # Pour compatibilité
            "user_id": user_id,
            "original_filename": file.filename,
            "filename": filename,
            "file_path": file_path,
            "file_size": len(content),
            "file_type": file.content_type,
            "analysis_status": "pending",
            "uploaded_at": datetime.utcnow()
        }
        
        await db.files.insert_one(file_doc)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "size": len(content),
            "status": "uploaded",
            "message": "Fichier uploadé avec succès"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'upload: {str(e)}")

@router.get("/list")
async def list_files(
    token: str = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Lister les fichiers de l'utilisateur"""
    try:
        # Vérifier le token
        payload = verify_token(token.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Token invalide")
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token invalide")
        
        # Récupérer les fichiers de l'utilisateur
        files_cursor = db.files.find(
            {"user_id": user_id},
            {"_id": 0, "file_path": 0}  # Exclure les champs sensibles
        ).sort("upload_date", -1)
        
        files = await files_cursor.to_list(length=None)
        
        return files
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération: {str(e)}")

@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    token: str = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Supprimer un fichier"""
    try:
        # Vérifier le token
        payload = verify_token(token.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Token invalide")
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token invalide")
        
        # Récupérer le fichier
        file_doc = await db.files.find_one({
            "$or": [{"file_id": file_id}, {"id": file_id}],
            "user_id": user_id
        })
        
        if not file_doc:
            raise HTTPException(status_code=404, detail="Fichier non trouvé")
        
        # Supprimer le fichier physique
        if os.path.exists(file_doc["file_path"]):
            os.remove(file_doc["file_path"])
        
        # Supprimer de la base de données
        await db.files.delete_one({
            "$or": [{"file_id": file_id}, {"id": file_id}],
            "user_id": user_id
        })
        
        return {"message": "Fichier supprimé avec succès"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression: {str(e)}")

@router.post("/ask")
async def ask_with_file(
    request: dict,
    token: str = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Poser une question avec le contexte d'un fichier"""
    try:
        # Vérifier le token
        payload = verify_token(token.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Token invalide")
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token invalide")
        
        file_id = request.get("file_id")
        question = request.get("question")
        ai_model = request.get("ai_model", "chatgpt")  # Modèle par défaut
        
        if not file_id or not question:
            raise HTTPException(status_code=400, detail="file_id et question sont requis")
        
        # Vérifier que le fichier appartient à l'utilisateur
        file_doc = await db.files.find_one({
            "$or": [{"file_id": file_id}, {"id": file_id}],
            "user_id": user_id
        })
        
        if not file_doc:
            raise HTTPException(status_code=404, detail="Fichier non trouvé")
        
        # Vérifier que le fichier existe physiquement
        file_path = file_doc["file_path"]
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Fichier physique non trouvé")
        
        # Traiter la question avec le contexte du fichier
        try:
            ai_response = await call_ai_with_file_context(
                message=question,
                file_path=file_path,
                original_filename=file_doc["original_filename"],
                ai_model=ai_model
            )
            
            return {
                "response": ai_response,
                "file_info": {
                    "filename": file_doc["original_filename"],
                    "file_id": file_id,
                    "ai_model": ai_model
                },
                "question": question
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erreur lors du traitement de la question: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement: {str(e)}")