from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Chat Models
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    session_name: str = "Nouvelle conversation"
    message: str
    chatgpt_response: Optional[str] = None
    gemini_response: Optional[str] = None
    deepseek_response: Optional[str] = None
    claude_response: Optional[str] = None
    mode: str  # 'compare', 'chatgpt', 'gemini', 'deepseek', 'claude'
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    session_id: str
    session_name: Optional[str] = "Nouvelle conversation"
    message: str
    mode: str  # 'compare', 'chatgpt', 'gemini', 'deepseek', 'claude'
    file_id: Optional[str] = None  # ID du fichier pour le contexte

class ChatResponse(BaseModel):
    id: str
    chatgpt_response: Optional[str] = None
    gemini_response: Optional[str] = None
    deepseek_response: Optional[str] = None
    claude_response: Optional[str] = None
    chatgpt_response_time: Optional[float] = None
    gemini_response_time: Optional[float] = None
    deepseek_response_time: Optional[float] = None
    claude_response_time: Optional[float] = None
    mode: str
    timestamp: datetime

class ChatSession(BaseModel):
    session_id: str
    session_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    message_count: int = 0

# Status Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# User Management Models
class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class UserResponse(BaseModel):
    id: str
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse