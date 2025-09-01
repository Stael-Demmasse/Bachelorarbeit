from fastapi import APIRouter, HTTPException, Depends
from config.database import get_database
from models.schemas import UserCreate, UserLogin, UserResponse, Token, User
from services.auth_service import hash_password, verify_password, create_access_token, get_current_user
import uuid
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    db = await get_database()
    if db is None:
        logger.error("Database connection is None")
        raise HTTPException(status_code=500, detail="Erreur de connexion à la base de données")
    
    # Check if username already exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà utilisé")
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    user_doc = {
        "id": user_id,
        "username": user_data.username,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    
    try:
        await db.users.insert_one(user_doc)
        logger.info(f"User registered: {user_data.username}")
        
        return UserResponse(
            id=user_id,
            username=user_data.username
        )
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'inscription")

@router.post("/login", response_model=Token)
async def login_user(user_data: UserLogin):
    """Login user and return access token"""
    db = await get_database()
    if db is None:
        logger.error("Database connection is None")
        raise HTTPException(status_code=500, detail="Erreur de connexion à la base de données")
    
    # Find user by username
    user = await db.users.find_one({"username": user_data.username})
    if not user:
        raise HTTPException(status_code=401, detail="Nom d'utilisateur ou mot de passe incorrect")
    
    # Verify password
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Nom d'utilisateur ou mot de passe incorrect")
    
    # Create access token
    access_token = create_access_token({"user_id": user["id"]})
    
    logger.info(f"User logged in: {user_data.username}")
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            username=user["username"]
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        username=current_user.username
    )