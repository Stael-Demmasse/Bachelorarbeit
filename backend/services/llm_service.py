import asyncio
import uuid
import logging
import aiohttp
import json
import time
from config.settings import OPENAI_API_KEY, GEMINI_API_KEY, DEEPSEEK_API_KEY, CLAUDE_API_KEY
from services.file_processor import extract_file_content, truncate_content
import os

logger = logging.getLogger(__name__)

async def call_chatgpt_api(message: str) -> tuple[str, float]:
    """
    Call ChatGPT API (OpenAI) - Direct API implementation
    Returns: (response_text, response_time_seconds)
    """
    start_time = time.time()
    
    if not OPENAI_API_KEY or OPENAI_API_KEY == "your_openai_api_key_here":
        return "ChatGPT API Key manquante. Ajoutez OPENAI_API_KEY dans .env", 0.0
    
    try:
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an intelligent and helpful AI assistant. Respond clearly and precisely in the same language as the user's question. If the user writes in English, respond in English. If the user writes in French, respond in French."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            "max_tokens": 1500,
            "temperature": 0.7
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    end_time = time.time()
                    response_time = end_time - start_time
                    return data["choices"][0]["message"]["content"], response_time
                else:
                    error_text = await response.text()
                    logger.error(f"OpenAI API Error {response.status}: {error_text}")
                    end_time = time.time()
                    response_time = end_time - start_time
                    return f"Erreur ChatGPT API ({response.status}): {error_text}", response_time
                    
    except Exception as e:
        logger.error(f"ChatGPT API Error: {str(e)}")
        end_time = time.time()
        response_time = end_time - start_time
        return f"Erreur ChatGPT: {str(e)}", response_time

async def call_gemini_api(message: str) -> tuple[str, float]:
    """
    Call Gemini API (Google) - Direct API implementation
    Returns: (response_text, response_time_seconds)
    """
    start_time = time.time()
    
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return "Gemini API Key manquante. Ajoutez GEMINI_API_KEY dans .env", 0.0
    
    try:
        headers = {
            "Content-Type": "application/json"
        }
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"You are an intelligent and creative AI assistant. Respond in detail and engagingly in the same language as the user's question. If the user writes in English, respond in English. If the user writes in French, respond in French.\n\nQuestion: {message}"
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 1500
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={GEMINI_API_KEY}",
                headers=headers,
                json=payload
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    end_time = time.time()
                    response_time = end_time - start_time
                    return data["candidates"][0]["content"]["parts"][0]["text"], response_time
                else:
                    error_text = await response.text()
                    logger.error(f"Gemini API Error {response.status}: {error_text}")
                    end_time = time.time()
                    response_time = end_time - start_time
                    return f"Erreur Gemini API ({response.status}): {error_text}", response_time
                    
    except Exception as e:
        logger.error(f"Gemini API Error: {str(e)}")
        end_time = time.time()
        response_time = end_time - start_time
        return f"Erreur Gemini: {str(e)}", response_time

async def call_deepseek_api(message: str) -> tuple[str, float]:
    """
    Call DeepSeek API - Real implementation using OpenAI-compatible endpoint
    Returns: (response_text, response_time_seconds)
    """
    start_time = time.time()
    
    if not DEEPSEEK_API_KEY:
        return "DeepSeek API Key manquante. Ajoutez DEEPSEEK_API_KEY dans .env", 0.0
    
    try:
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "system",
                    "content": "You are DeepSeek, an AI assistant that excels in logical reasoning and code analysis. Respond thoroughly and technically in the same language as the user's question. If the user writes in English, respond in English. If the user writes in French, respond in French."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            "max_tokens": 1500,
            "temperature": 0.7
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    end_time = time.time()
                    response_time = end_time - start_time
                    return data["choices"][0]["message"]["content"], response_time
                else:
                    error_text = await response.text()
                    logger.error(f"DeepSeek API Error {response.status}: {error_text}")
                    end_time = time.time()
                    response_time = end_time - start_time
                    return f"Erreur DeepSeek API ({response.status}): {error_text}", response_time
                    
    except Exception as e:
        logger.error(f"DeepSeek API Error: {str(e)}")
        end_time = time.time()
        response_time = end_time - start_time
        return f"Erreur DeepSeek: {str(e)}", response_time

async def call_claude_api(message: str) -> tuple[str, float]:
    """
    Call Claude API (Anthropic) - Direct API implementation
    Returns: (response_text, response_time_seconds)
    """
    start_time = time.time()
    
    if not CLAUDE_API_KEY or CLAUDE_API_KEY == "your_claude_api_key_here":
        return "Claude API Key manquante. Ajoutez CLAUDE_API_KEY dans .env", 0.0
    
    try:
        headers = {
            "x-api-key": CLAUDE_API_KEY,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        
        payload = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 1500,
            "temperature": 0.7,
            "system": "You are Claude, an AI assistant developed by Anthropic. You are helpful, harmless, and honest. Always respond in the same language as the user's question. If the user writes in English, respond in English. If the user writes in French, respond in French.",
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ]
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=payload
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    end_time = time.time()
                    response_time = end_time - start_time
                    return data["content"][0]["text"], response_time
                else:
                    error_text = await response.text()
                    logger.error(f"Claude API Error {response.status}: {error_text}")
                    end_time = time.time()
                    response_time = end_time - start_time
                    return f"Erreur Claude API ({response.status}): {error_text}", response_time
                    
    except Exception as e:
        logger.error(f"Claude API Error: {str(e)}")
        end_time = time.time()
        response_time = end_time - start_time
        return f"Erreur Claude: {str(e)}", response_time

async def create_context_message(message: str, file_path: str, original_filename: str) -> str:
    """
    Crée un message avec le contexte du fichier
    """
    try:
        # Extraire l'extension du fichier
        file_extension = os.path.splitext(file_path)[1].lower()
        
        # Extraire le contenu du fichier
        file_content = await extract_file_content(file_path, file_extension)
        
        if not file_content:
            return f"Erreur: Impossible de lire le contenu du fichier {original_filename}"
        
        # Tronquer le contenu si nécessaire
        truncated_content = truncate_content(file_content, max_length=6000)
        
        # Créer le message contextuel
        context_message = f"""Voici le contenu du fichier "{original_filename}":

--- DÉBUT DU FICHIER ---
{truncated_content}
--- FIN DU FICHIER ---

Question de l'utilisateur: {message}

Veuillez répondre à la question en vous basant sur le contenu du fichier ci-dessus. Si la question ne peut pas être répondue avec les informations du fichier, indiquez-le clairement."""
        
        return context_message
        
    except Exception as e:
        logger.error(f"Erreur lors de la création du contexte: {str(e)}")
        return f"Erreur lors du traitement du fichier: {str(e)}"

async def call_ai_with_file_context(message: str, file_path: str, original_filename: str, ai_model: str) -> tuple[str, float]:
    """
    Appelle une IA avec le contexte d'un fichier
    Returns: (response_text, response_time_seconds)
    """
    try:
        # Créer le message avec contexte
        context_message = await create_context_message(message, file_path, original_filename)
        
        # Appeler l'IA appropriée
        if ai_model == "chatgpt":
            return await call_chatgpt_api(context_message)
        elif ai_model == "gemini":
            return await call_gemini_api(context_message)
        elif ai_model == "deepseek":
            return await call_deepseek_api(context_message)
        elif ai_model == "claude":
            return await call_claude_api(context_message)
        else:
            return f"Modèle IA non supporté: {ai_model}", 0.0
            
    except Exception as e:
        logger.error(f"Erreur lors de l'appel IA avec contexte: {str(e)}")
        return f"Erreur lors du traitement: {str(e)}", 0.0