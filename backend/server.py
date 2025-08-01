from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging

# Import configuration
from config.settings import (
    API_TITLE, API_VERSION, CORS_ORIGINS, CORS_CREDENTIALS,
    CORS_METHODS, CORS_HEADERS, HOST, PORT, RELOAD
)
from config.database import connect_to_mongo, close_mongo_connection

# Import routes
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.status import router as status_router
from routes.files import router as files_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting up AI Chatbot API...")
    await connect_to_mongo()
    yield
    # Shutdown
    logger.info("Shutting down AI Chatbot API...")
    await close_mongo_connection()

# Create FastAPI application
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_CREDENTIALS,
    allow_methods=CORS_METHODS,
    allow_headers=CORS_HEADERS,
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(status_router, prefix="/api")
app.include_router(files_router, prefix="/api")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Chatbot API",
        "version": API_VERSION,
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "auth": "/api/auth",
            "chat": "/api/chat",
            "status": "/api/status",
            "files": "/api/files"
        }
    }

if __name__ == "__main__":
    logger.info(f"Starting server on {HOST}:{PORT}")
    
    # Check if SSL certificates exist
    import os
    ssl_keyfile = "localhost-key.pem"
    ssl_certfile = "localhost.pem"
    
    if os.path.exists(ssl_keyfile) and os.path.exists(ssl_certfile):
        logger.info("Starting HTTPS server with SSL certificates")
        uvicorn.run(
            "server:app",
            host=HOST,
            port=PORT,
            reload=RELOAD,
            ssl_keyfile=ssl_keyfile,
            ssl_certfile=ssl_certfile
        )
    else:
        logger.warning("SSL certificates not found, starting HTTP server")
        uvicorn.run(
            "server:app",
            host=HOST,
            port=PORT,
            reload=RELOAD
        )