import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']

async def check_files_in_database():
    """Check files in MongoDB database"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # Get all files from file_uploads collection
        files_cursor = db.file_uploads.find({})
        files = await files_cursor.to_list(length=None)
        
        print(f"\n=== FICHIERS DANS LA BASE DE DONNÉES ===")
        print(f"Nombre total de fichiers: {len(files)}")
        print("="*50)
        
        if files:
            for i, file in enumerate(files, 1):
                print(f"\n{i}. Fichier ID: {file.get('id', 'N/A')}")
                print(f"   Nom original: {file.get('original_filename', 'N/A')}")
                print(f"   Type: {file.get('file_type', 'N/A')}")
                print(f"   Taille: {file.get('file_size', 0)} bytes")
                print(f"   Utilisateur ID: {file.get('user_id', 'N/A')}")
                print(f"   Date upload: {file.get('upload_date', 'N/A')}")
                print(f"   Statut analyse: {file.get('analysis_status', 'N/A')}")
                print(f"   Chemin fichier: {file.get('file_path', 'N/A')}")
        else:
            print("\nAucun fichier trouvé dans la base de données.")
            
    except Exception as e:
        print(f"Erreur lors de la vérification: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_files_in_database())