from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from config.database import get_database
from models.schemas import ChatRequest, ChatResponse, ChatMessage, ChatSession, User
from services.auth_service import get_current_user
from services.llm_service import call_chatgpt_api, call_gemini_api, call_deepseek_api, call_claude_api, call_ai_with_file_context
import uuid
import asyncio
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """Main chat endpoint supporting multiple AI models"""
    db = get_database()
    
    try:
        # Generate message ID
        message_id = str(uuid.uuid4())
        
        # Vérifier si un fichier est attaché
        file_doc = None
        if request.file_id:
            file_doc = await db.files.find_one({
                "$or": [{"file_id": request.file_id}, {"id": request.file_id}],
                "user_id": current_user.id
            })
            if not file_doc:
                raise HTTPException(status_code=404, detail="Fichier non trouvé")
        
        # Create base message document
        message_doc = {
            "id": message_id,
            "session_id": request.session_id,
            "message": request.message,
            "mode": request.mode,
            "timestamp": datetime.utcnow(),
            "user_id": current_user.id,
            "file_id": request.file_id
        }
        
        if request.mode == "compare":
            # Call all APIs concurrently
            if file_doc:
                # Avec contexte de fichier
                tasks = [
                    call_ai_with_file_context(request.message, file_doc["file_path"], file_doc["original_filename"], "chatgpt"),
                    call_ai_with_file_context(request.message, file_doc["file_path"], file_doc["original_filename"], "gemini"),
                    call_ai_with_file_context(request.message, file_doc["file_path"], file_doc["original_filename"], "deepseek"),
                    call_ai_with_file_context(request.message, file_doc["file_path"], file_doc["original_filename"], "claude")
                ]
            else:
                # Sans contexte de fichier
                tasks = [
                    call_chatgpt_api(request.message),
                    call_gemini_api(request.message),
                    call_deepseek_api(request.message),
                    call_claude_api(request.message)
                ]
            
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Handle responses and exceptions with timing
            chatgpt_response, chatgpt_time = responses[0] if not isinstance(responses[0], Exception) else (f"Erreur: {responses[0]}", 0.0)
            gemini_response, gemini_time = responses[1] if not isinstance(responses[1], Exception) else (f"Erreur: {responses[1]}", 0.0)
            deepseek_response, deepseek_time = responses[2] if not isinstance(responses[2], Exception) else (f"Erreur: {responses[2]}", 0.0)
            claude_response, claude_time = responses[3] if not isinstance(responses[3], Exception) else (f"Erreur: {responses[3]}", 0.0)
            
            message_doc.update({
                "chatgpt_response": chatgpt_response,
                "gemini_response": gemini_response,
                "deepseek_response": deepseek_response,
                "claude_response": claude_response,
                "chatgpt_response_time": chatgpt_time,
                "gemini_response_time": gemini_time,
                "deepseek_response_time": deepseek_time,
                "claude_response_time": claude_time
            })
            
            response_text = f"**ChatGPT ({chatgpt_time:.2f}s):**\n{chatgpt_response}\n\n**Gemini ({gemini_time:.2f}s):**\n{gemini_response}\n\n**DeepSeek ({deepseek_time:.2f}s):**\n{deepseek_response}\n\n**Claude ({claude_time:.2f}s):**\n{claude_response}"
            
        elif request.mode == "chatgpt":
            if file_doc:
                response_text, response_time = await call_ai_with_file_context(request.message, file_doc["file_path"], file_doc["original_filename"], "chatgpt")
            else:
                response_text, response_time = await call_chatgpt_api(request.message)
            message_doc["chatgpt_response"] = response_text
            message_doc["chatgpt_response_time"] = response_time
            
        elif request.mode == "gemini":
            if file_doc:
                response_text, response_time = await call_ai_with_file_context(request.message, file_doc["file_path"], file_doc["original_filename"], "gemini")
            else:
                response_text, response_time = await call_gemini_api(request.message)
            message_doc["gemini_response"] = response_text
            message_doc["gemini_response_time"] = response_time
            
        elif request.mode == "deepseek":
            if file_doc:
                response_text, response_time = await call_ai_with_file_context(request.message, file_doc["file_path"], file_doc["original_filename"], "deepseek")
            else:
                response_text, response_time = await call_deepseek_api(request.message)
            message_doc["deepseek_response"] = response_text
            message_doc["deepseek_response_time"] = response_time
            
        elif request.mode == "claude":
            if file_doc:
                response_text, response_time = await call_ai_with_file_context(request.message, file_doc["file_path"], file_doc["original_filename"], "claude")
            else:
                response_text, response_time = await call_claude_api(request.message)
            message_doc["claude_response"] = response_text
            message_doc["claude_response_time"] = response_time
            
        else:
            raise HTTPException(status_code=400, detail="Mode non supporté")
        
        # Save message to database
        await db.chat_messages.insert_one(message_doc)
        
        logger.info(f"Chat message processed: {request.mode} for user {current_user.id}")
        
        # Prepare response based on mode
        if request.mode == "compare":
            return ChatResponse(
                id=message_id,
                chatgpt_response=chatgpt_response,
                gemini_response=gemini_response,
                deepseek_response=deepseek_response,
                claude_response=claude_response,
                chatgpt_response_time=chatgpt_time,
                gemini_response_time=gemini_time,
                deepseek_response_time=deepseek_time,
                claude_response_time=claude_time,
                mode=request.mode,
                timestamp=datetime.utcnow()
            )
        else:
            # For single model responses
            response_data = {
                "id": message_id,
                "mode": request.mode,
                "timestamp": datetime.utcnow(),
                "chatgpt_response": None,
                "gemini_response": None,
                "deepseek_response": None,
                "claude_response": None,
                "chatgpt_response_time": None,
                "gemini_response_time": None,
                "deepseek_response_time": None,
                "claude_response_time": None
            }
            
            # Set the appropriate response field
            if request.mode == "chatgpt":
                response_data["chatgpt_response"] = response_text
                response_data["chatgpt_response_time"] = response_time
            elif request.mode == "gemini":
                response_data["gemini_response"] = response_text
                response_data["gemini_response_time"] = response_time
            elif request.mode == "deepseek":
                response_data["deepseek_response"] = response_text
                response_data["deepseek_response_time"] = response_time
            elif request.mode == "claude":
                response_data["claude_response"] = response_text
                response_data["claude_response_time"] = response_time
                
            return ChatResponse(**response_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement: {str(e)}")

@router.get("/sessions", response_model=List[ChatSession])
async def get_chat_sessions(current_user: User = Depends(get_current_user)):
    """Get all chat sessions for the current user"""
    db = get_database()
    
    try:
        # Get unique sessions with latest message and AI response
        pipeline = [
            {"$match": {"user_id": current_user.id}},
            {"$sort": {"timestamp": -1}},
            {"$group": {
                "_id": "$session_id",
                "latest_message": {"$first": "$message"},
                "latest_chatgpt_response": {"$first": "$chatgpt_response"},
                "latest_gemini_response": {"$first": "$gemini_response"},
                "latest_deepseek_response": {"$first": "$deepseek_response"},
                "latest_claude_response": {"$first": "$claude_response"},
                "latest_timestamp": {"$first": "$timestamp"},
                "message_count": {"$sum": 1}
            }}
        ]
        
        sessions_cursor = db.chat_messages.aggregate(pipeline)
        sessions_data = await sessions_cursor.to_list(length=None)
        
        sessions = []
        for session in sessions_data:
            latest_message = session.get("latest_message", "Nouvelle conversation")
            
            # Get the AI response (prioritize non-null responses)
            ai_response = (
                session.get("latest_chatgpt_response") or 
                session.get("latest_gemini_response") or 
                session.get("latest_deepseek_response") or 
                session.get("latest_claude_response") or 
                "Pas de réponse"
            )
            
            # Create session name with both user message and AI response
            if ai_response and ai_response != "Pas de réponse":
                conversation_preview = f"Vous: {latest_message[:30]}... | IA: {ai_response[:30]}..."
            else:
                conversation_preview = f"Vous: {latest_message[:50]}..."
            
            # Truncate if too long
            session_name = conversation_preview[:80] + "..." if len(conversation_preview) > 80 else conversation_preview
            
            sessions.append(ChatSession(
                session_id=session["_id"],
                session_name=session_name,
                created_at=session["latest_timestamp"],
                updated_at=session["latest_timestamp"],
                message_count=session["message_count"]
            ))
        
        return sorted(sessions, key=lambda x: x.updated_at, reverse=True)
        
    except Exception as e:
        logger.error(f"Get sessions error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des sessions")

@router.put("/sessions/{session_id}")
async def update_session(
    session_id: str,
    session_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Update session metadata"""
    # For now, just return success - extend as needed
    return {"message": "Session mise à jour", "session_id": session_id}

@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a chat session and all its messages"""
    db = get_database()
    
    try:
        # Delete all messages in the session
        result = await db.chat_messages.delete_many({
            "session_id": session_id,
            "user_id": current_user.id
        })
        
        logger.info(f"Session deleted: {session_id} ({result.deleted_count} messages) by user {current_user.id}")
        
        return {
            "message": "Session supprimée",
            "session_id": session_id,
            "deleted_messages": result.deleted_count
        }
        
    except Exception as e:
        logger.error(f"Delete session error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")

@router.get("/chat/history/{session_id}", response_model=List[ChatMessage])
async def get_chat_history(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get chat history for a specific session"""
    db = get_database()
    
    try:
        messages_cursor = db.chat_messages.find({
            "session_id": session_id,
            "user_id": current_user.id
        }).sort("timestamp", 1)
        
        messages = await messages_cursor.to_list(length=None)
        
        return [ChatMessage(**message) for message in messages]
        
    except Exception as e:
        logger.error(f"Get chat history error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération de l'historique")

@router.delete("/chat/history/{session_id}")
async def clear_chat_history(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """Clear chat history for a specific session"""
    db = get_database()
    
    try:
        result = await db.chat_messages.delete_many({
            "session_id": session_id,
            "user_id": current_user.id
        })
        
        logger.info(f"Chat history cleared: {session_id} ({result.deleted_count} messages) by user {current_user.id}")
        
        return {
            "message": "Historique effacé",
            "session_id": session_id,
            "deleted_messages": result.deleted_count
        }
        
    except Exception as e:
        logger.error(f"Clear chat history error: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'effacement")