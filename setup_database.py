#!/usr/bin/env python3
"""
Script de configuration manuelle de la base de données MongoDB
Utilisez ce script pour initialiser votre base de données sans Docker

Prérequis:
- MongoDB installé et en cours d'exécution
- pymongo installé: pip install pymongo

Utilisation:
    python setup_database.py
"""

import pymongo
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure
import sys
from datetime import datetime
import getpass

# Configuration par défaut pour MongoDB Atlas
DEFAULT_CONFIG = {
    'atlas_url': 'mongodb+srv://demmassetemgouastael:FxtnMjDfAO41ioww@cluster0.lpyb7f2.mongodb.net',
    'database_name': 'chatbot_db',
    'app_username': 'username',
    'app_password': 'password'
}

def get_user_config():
    """Demande la configuration à l'utilisateur"""
    print("=== Configuration de la base de données MongoDB Atlas ===")
    print("Appuyez sur Entrée pour utiliser les valeurs par défaut\n")
    
    config = {}
    
    # URL Atlas
    atlas_url = input(f"URL MongoDB Atlas [{DEFAULT_CONFIG['atlas_url']}]: ").strip()
    config['atlas_url'] = atlas_url if atlas_url else DEFAULT_CONFIG['atlas_url']
    
    # Nom de la base de données
    db_name = input(f"Nom de la base de données [{DEFAULT_CONFIG['database_name']}]: ").strip()
    config['database_name'] = db_name if db_name else DEFAULT_CONFIG['database_name']
    
    # Utilisateur de l'application
    app_user = input(f"Nom d'utilisateur de l'application [{DEFAULT_CONFIG['app_username']}]: ").strip()
    config['app_username'] = app_user if app_user else DEFAULT_CONFIG['app_username']
    
    # Mot de passe de l'application
    print(f"Mot de passe par défaut: {DEFAULT_CONFIG['app_password']}")
    use_default_pwd = input("Utiliser le mot de passe par défaut? (y/n) [y]: ").strip().lower()
    
    if use_default_pwd in ['n', 'no', 'non']:
        config['app_password'] = getpass.getpass("Nouveau mot de passe: ")
    else:
        config['app_password'] = DEFAULT_CONFIG['app_password']
    
    return config

def test_connection(atlas_url):
    """Teste la connexion à MongoDB Atlas"""
    try:
        client = MongoClient(atlas_url, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print(f"✅ Connexion réussie à MongoDB Atlas")
        return client
    except ConnectionFailure:
        print(f"❌ Impossible de se connecter à MongoDB Atlas")
        print("Vérifiez votre URL de connexion et votre accès réseau.")
        return None

def create_database_and_user(client, config):
    """Crée la base de données et l'utilisateur"""
    try:
        # Sélectionner la base de données
        db = client[config['database_name']]
        
        # Pour MongoDB Atlas, l'utilisateur existe déjà, on ignore cette étape
        print(f"✅ Base de données '{config['database_name']}' sélectionnée")
        print(f"✅ Utilisateur '{config['app_username']}' (géré par Atlas)")
        
        return db
        
    except Exception as e:
        print(f"❌ Erreur lors de l'accès à la base de données: {e}")
        return None

def create_collections_with_validation(db):
    """Crée les collections avec validation de schéma"""
    
    # Collection chat_messages
    chat_messages_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["id", "user_id", "session_id", "message", "mode", "timestamp"],
            "properties": {
                "id": {
                    "bsonType": "string",
                    "description": "ID unique du message"
                },
                "user_id": {
                    "bsonType": "string",
                    "description": "ID de l'utilisateur propriétaire"
                },
                "session_id": {
                    "bsonType": "string",
                    "description": "ID de la session de chat"
                },
                "session_name": {
                    "bsonType": "string",
                    "description": "Nom de la session"
                },
                "message": {
                    "bsonType": "string",
                    "description": "Message de l'utilisateur"
                },
                "response_chatgpt": {
                    "bsonType": ["string", "null"],
                    "description": "Réponse de ChatGPT"
                },
                "response_gemini": {
                    "bsonType": ["string", "null"],
                    "description": "Réponse de Gemini"
                },
                "response_deepseek": {
                    "bsonType": ["string", "null"],
                    "description": "Réponse de DeepSeek"
                },
                "response_claude": {
                    "bsonType": ["string", "null"],
                    "description": "Réponse de Claude"
                },
                "mode": {
                    "bsonType": "string",
                    "enum": ["compare", "chatgpt", "gemini", "deepseek", "claude"],
                    "description": "Mode de chat utilisé"
                },
                "timestamp": {
                    "bsonType": "date",
                    "description": "Timestamp du message"
                }
            }
        }
    }
    
    # Collection status_checks
    status_checks_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["id", "client_name", "timestamp"],
            "properties": {
                "id": {
                    "bsonType": "string",
                    "description": "ID unique du status check"
                },
                "client_name": {
                    "bsonType": "string",
                    "description": "Nom du client"
                },
                "timestamp": {
                    "bsonType": "date",
                    "description": "Timestamp du check"
                }
            }
        }
    }
    
    # Collection users (pour l'authentification)
    users_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["id", "username", "password", "created_at", "is_active"],
            "properties": {
                "id": {
                    "bsonType": "string",
                    "description": "ID unique de l'utilisateur"
                },
                "username": {
                    "bsonType": "string",
                    "description": "Nom d'utilisateur (unique)"
                },
                "password": {
                    "bsonType": "string",
                    "description": "Hash du mot de passe (SHA-256)"
                },
                "created_at": {
                    "bsonType": "date",
                    "description": "Date de création du compte"
                },
                "is_active": {
                    "bsonType": "bool",
                    "description": "Statut actif de l'utilisateur"
                }
            }
        }
    }
    
    # Collection files (pour la gestion des fichiers)
    files_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["id", "user_id", "filename", "original_filename", "file_type", "file_size", "file_path", "analysis_status", "uploaded_at"],
            "properties": {
                "id": {
                    "bsonType": "string",
                    "description": "ID unique du fichier"
                },
                "user_id": {
                    "bsonType": "string",
                    "description": "ID de l'utilisateur propriétaire"
                },
                "filename": {
                    "bsonType": "string",
                    "description": "Nom du fichier stocké"
                },
                "original_filename": {
                    "bsonType": "string",
                    "description": "Nom original du fichier"
                },
                "file_type": {
                    "bsonType": "string",
                    "description": "Type MIME du fichier"
                },
                "file_size": {
                    "bsonType": "int",
                    "description": "Taille du fichier en octets"
                },
                "file_path": {
                    "bsonType": "string",
                    "description": "Chemin de stockage du fichier"
                },
                "analysis_status": {
                    "bsonType": "string",
                    "enum": ["pending", "processing", "completed", "failed"],
                    "description": "Statut de l'analyse du fichier"
                },
                "analysis_result": {
                    "bsonType": ["string", "null"],
                    "description": "Résultat de l'analyse du fichier"
                },
                "uploaded_at": {
                    "bsonType": "date",
                    "description": "Date d'upload du fichier"
                }
            }
        }
    }
    
    # Collection file_chunks (pour le stockage des chunks de fichiers avec embeddings)
    file_chunks_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["id", "file_id", "user_id", "chunk_text", "chunk_index", "created_at"],
            "properties": {
                "id": {
                    "bsonType": "string",
                    "description": "ID unique du chunk"
                },
                "file_id": {
                    "bsonType": "string",
                    "description": "ID du fichier parent"
                },
                "user_id": {
                    "bsonType": "string",
                    "description": "ID de l'utilisateur propriétaire"
                },
                "filename": {
                    "bsonType": "string",
                    "description": "Nom du fichier original"
                },
                "chunk_text": {
                    "bsonType": "string",
                    "description": "Contenu textuel du chunk"
                },
                "chunk_index": {
                    "bsonType": "int",
                    "description": "Index du chunk dans le fichier"
                },
                "chunk_size": {
                    "bsonType": "int",
                    "description": "Taille du chunk en caractères"
                },
                "embedding": {
                    "bsonType": "array",
                    "description": "Vecteur d'embedding du chunk",
                    "items": {
                        "bsonType": "double"
                    }
                },
                "metadata": {
                    "bsonType": "object",
                    "description": "Métadonnées additionnelles du chunk",
                    "properties": {
                        "page_number": {
                            "bsonType": ["int", "null"],
                            "description": "Numéro de page (pour PDF)"
                        },
                        "section": {
                            "bsonType": ["string", "null"],
                            "description": "Section du document"
                        }
                    }
                },
                "created_at": {
                    "bsonType": "date",
                    "description": "Date de création du chunk"
                }
            }
        }
    }
    
    # Collection sessions (pour la gestion des sessions de chat)
    sessions_validator = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["session_id", "user_id", "session_name", "created_at", "updated_at", "message_count"],
            "properties": {
                "session_id": {
                    "bsonType": "string",
                    "description": "ID unique de la session"
                },
                "user_id": {
                    "bsonType": "string",
                    "description": "ID de l'utilisateur propriétaire"
                },
                "session_name": {
                    "bsonType": "string",
                    "description": "Nom de la session de chat"
                },
                "created_at": {
                    "bsonType": "date",
                    "description": "Date de création de la session"
                },
                "updated_at": {
                    "bsonType": "date",
                    "description": "Date de dernière mise à jour"
                },
                "message_count": {
                    "bsonType": "int",
                    "description": "Nombre de messages dans la session"
                }
            }
        }
    }
    
    collections_to_create = [
        ("chat_messages", chat_messages_validator),
        ("status_checks", status_checks_validator),
        ("users", users_validator),
        ("files", files_validator),
        ("file_chunks", file_chunks_validator),
        ("sessions", sessions_validator)
    ]
    
    for collection_name, validator in collections_to_create:
        try:
            db.create_collection(collection_name, validator=validator)
            print(f"✅ Collection '{collection_name}' créée avec validation")
        except OperationFailure as e:
            if "already exists" in str(e):
                print(f"⚠️  Collection '{collection_name}' existe déjà")
            else:
                print(f"❌ Erreur lors de la création de '{collection_name}': {e}")
        except Exception as e:
            if "already exists" in str(e):
                print(f"⚠️  Collection '{collection_name}' existe déjà")
            else:
                print(f"❌ Erreur lors de la création de '{collection_name}': {e}")

def create_indexes(db):
    """Crée les index pour optimiser les performances"""
    
    indexes_to_create = [
        # Index pour chat_messages
        ("chat_messages", "user_id", 1),
        ("chat_messages", "session_id", 1),
        ("chat_messages", "timestamp", -1),
        ("chat_messages", [("user_id", 1), ("session_id", 1)], None),
        ("chat_messages", [("session_id", 1), ("timestamp", 1)], None),
        
        # Index pour status_checks
        ("status_checks", "timestamp", -1),
        ("status_checks", "client_name", 1),
        
        # Index pour users
        ("users", "username", 1),
        ("users", "created_at", -1),
        ("users", "is_active", 1),
        
        # Index pour files
        ("files", "user_id", 1),
        ("files", "uploaded_at", -1),
        ("files", "analysis_status", 1),
        ("files", [("user_id", 1), ("uploaded_at", -1)], None),
        ("files", [("user_id", 1), ("analysis_status", 1)], None),
        
        # Index pour file_chunks
        ("file_chunks", "file_id", 1),
        ("file_chunks", "user_id", 1),
        ("file_chunks", "chunk_index", 1),
        ("file_chunks", "created_at", -1),
        ("file_chunks", [("file_id", 1), ("chunk_index", 1)], None),
        ("file_chunks", [("user_id", 1), ("file_id", 1)], None),
        ("file_chunks", [("user_id", 1), ("created_at", -1)], None),
        
        # Index pour sessions
        ("sessions", "user_id", 1),
        ("sessions", "session_id", 1),
        ("sessions", "created_at", -1),
        ("sessions", "updated_at", -1),
        ("sessions", [("user_id", 1), ("created_at", -1)], None)
    ]
    
    for collection_name, field, direction in indexes_to_create:
        try:
            if isinstance(field, list):
                # Index composé
                db[collection_name].create_index(field)
                field_names = ", ".join([f"{f[0]}({f[1]})" for f in field])
                print(f"✅ Index composé créé sur {collection_name}: {field_names}")
            else:
                # Index simple
                db[collection_name].create_index([(field, direction)])
                print(f"✅ Index créé sur {collection_name}.{field}")
        except Exception as e:
            field_name = field if not isinstance(field, list) else "composite"
            print(f"⚠️  Erreur lors de la création d'index sur {collection_name}.{field_name}: {e}")
    
    # Index uniques
    unique_indexes = [
        ("users", "username"),
        ("sessions", "session_id")
    ]
    
    for collection_name, field in unique_indexes:
        try:
            db[collection_name].create_index(field, unique=True)
            print(f"✅ Index unique créé sur {collection_name}.{field}")
        except Exception as e:
            print(f"⚠️  Erreur lors de la création d'index unique sur {collection_name}.{field}: {e}")

def insert_sample_data(db):
    """Insère des données d'exemple (optionnel)"""
    
    response = input("\nVoulez-vous insérer des données d'exemple? (y/n) [n]: ").strip().lower()
    
    if response in ['y', 'yes', 'oui']:
        try:
            from datetime import datetime
            import uuid
            
            # Données d'exemple pour users
            sample_user = {
                "id": str(uuid.uuid4()),
                "username": "testuser",
                "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDjS",  # "password123" hashé
                "created_at": datetime.utcnow(),
                "is_active": True
            }
            
            db.users.insert_one(sample_user)
            print("✅ Utilisateur d'exemple inséré dans users")
            
            # Données d'exemple pour sessions
            sample_session = {
                "session_id": str(uuid.uuid4()),
                "user_id": sample_user["id"],
                "session_name": "Session de test",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "message_count": 2
            }
            
            db.sessions.insert_one(sample_session)
            print("✅ Session d'exemple insérée dans sessions")
            
            # Données d'exemple pour chat_messages
            sample_messages = [
                {
                    "id": str(uuid.uuid4()),
                    "user_id": sample_user["id"],
                    "session_id": sample_session["session_id"],
                    "message": "Bonjour, comment ça va?",
                    "sender": "user",
                    "timestamp": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "user_id": sample_user["id"],
                    "session_id": sample_session["session_id"],
                    "message": "Bonjour! Je vais bien, merci. Comment puis-je vous aider?",
                    "sender": "assistant",
                    "timestamp": datetime.utcnow()
                }
            ]
            
            db.chat_messages.insert_many(sample_messages)
            print("✅ Messages d'exemple insérés dans chat_messages")
            
            # Données d'exemple pour status_checks
            sample_status = {
                "id": str(uuid.uuid4()),
                "client_name": "Test Client",
                "timestamp": datetime.utcnow()
            }
            
            db.status_checks.insert_one(sample_status)
            print("✅ Données d'exemple insérées dans status_checks")
            
            # Données d'exemple pour files
            sample_file = {
                "id": str(uuid.uuid4()),
                "user_id": sample_user["id"],
                "filename": "document_test.pdf",
                "original_filename": "Mon Document Test.pdf",
                "file_type": "application/pdf",
                "file_size": 1024000,
                "uploaded_at": datetime.utcnow(),
                "analysis_status": "completed",
                "analysis_result": "Document analysé avec succès"
            }
            
            db.files.insert_one(sample_file)
            print("✅ Fichier d'exemple inséré dans files")
            
            # Données d'exemple pour file_chunks
            sample_chunks = [
                {
                    "id": str(uuid.uuid4()),
                    "file_id": sample_file["id"],
                    "user_id": sample_user["id"],
                    "filename": sample_file["original_filename"],
                    "chunk_text": "Ceci est le premier chunk du document de test. Il contient du texte d'exemple pour démontrer le fonctionnement du système de chunking.",
                    "chunk_index": 0,
                    "chunk_size": 142,
                    "embedding": [0.1, 0.2, 0.3, 0.4, 0.5] * 307,  # Exemple d'embedding de 1536 dimensions
                    "metadata": {
                        "page_number": 1,
                        "section": "Introduction"
                    },
                    "created_at": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "file_id": sample_file["id"],
                    "user_id": sample_user["id"],
                    "filename": sample_file["original_filename"],
                    "chunk_text": "Voici le deuxième chunk du document. Il démontre comment les documents sont découpés en segments plus petits pour faciliter la recherche sémantique.",
                    "chunk_index": 1,
                    "chunk_size": 156,
                    "embedding": [0.2, 0.3, 0.4, 0.5, 0.6] * 307,  # Exemple d'embedding de 1536 dimensions
                    "metadata": {
                        "page_number": 1,
                        "section": "Contenu principal"
                    },
                    "created_at": datetime.utcnow()
                }
            ]
            
            db.file_chunks.insert_many(sample_chunks)
            print("✅ Chunks d'exemple insérés dans file_chunks")
            
        except Exception as e:
            print(f"⚠️  Erreur lors de l'insertion des données d'exemple: {e}")

def generate_connection_string(config):
    """Génère la chaîne de connexion pour l'application"""
    
    # Pour Atlas, on utilise l'URL complète avec la base de données
    connection_string = f"{config['atlas_url']}/{config['database_name']}?retryWrites=true&w=majority"
    
    print("\n" + "="*60)
    print("CONFIGURATION TERMINÉE")
    print("="*60)
    print(f"Base de données: {config['database_name']}")
    print(f"Utilisateur: {config['app_username']}")
    print(f"MongoDB Atlas: {config['atlas_url']}")
    print("\nChaîne de connexion pour votre application:")
    print(f"MONGO_URL={connection_string}")
    print("\nAjoutez cette ligne à votre fichier .env")
    print("="*60)

def main():
    """Fonction principale"""
    print("Script de configuration manuelle de MongoDB")
    print("============================================\n")
    
    # Obtenir la configuration
    config = get_user_config()
    
    # Tester la connexion
    client = test_connection(config['atlas_url'])
    if not client:
        sys.exit(1)
    
    # Créer la base de données et l'utilisateur
    db = create_database_and_user(client, config)
    if db is None:
        sys.exit(1)
    
    # Créer les collections avec validation
    print("\nCréation des collections...")
    create_collections_with_validation(db)
    
    # Créer les index
    print("\nCréation des index...")
    create_indexes(db)
    
    # Insérer des données d'exemple
    insert_sample_data(db)
    
    # Afficher la configuration finale
    generate_connection_string(config)
    
    # Fermer la connexion
    client.close()
    print("\n✅ Configuration terminée avec succès!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Configuration interrompue par l'utilisateur")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erreur inattendue: {e}")
        sys.exit(1)
