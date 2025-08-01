import os
import aiofiles
import PyPDF2
import docx
import json
import xml.etree.ElementTree as ET
import csv
from typing import Optional
import logging

logger = logging.getLogger(__name__)

async def extract_file_content(file_path: str, file_extension: str) -> Optional[str]:
    """
    Extrait le contenu textuel d'un fichier selon son extension
    """
    try:
        if not os.path.exists(file_path):
            logger.error(f"Fichier non trouvé: {file_path}")
            return None
            
        if file_extension == '.txt':
            return await extract_txt_content(file_path)
        elif file_extension == '.pdf':
            return await extract_pdf_content(file_path)
        elif file_extension == '.docx':
            return await extract_docx_content(file_path)
        elif file_extension == '.csv':
            return await extract_csv_content(file_path)
        elif file_extension == '.xlsx':
            return await extract_xlsx_content(file_path)
        elif file_extension == '.json':
            return await extract_json_content(file_path)
        elif file_extension == '.xml':
            return await extract_xml_content(file_path)
        elif file_extension == '.md':
            return await extract_txt_content(file_path)  # Markdown comme texte
        else:
            logger.warning(f"Extension non supportée pour l'extraction: {file_extension}")
            return None
            
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction du contenu de {file_path}: {str(e)}")
        return None

async def extract_txt_content(file_path: str) -> str:
    """Extrait le contenu d'un fichier texte"""
    async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
        return await f.read()

async def extract_pdf_content(file_path: str) -> str:
    """Extrait le contenu d'un fichier PDF"""
    content = ""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                content += page.extract_text() + "\n"
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction PDF: {str(e)}")
        return f"Erreur lors de la lecture du PDF: {str(e)}"
    return content

async def extract_docx_content(file_path: str) -> str:
    """Extrait le contenu d'un fichier DOCX"""
    try:
        doc = docx.Document(file_path)
        content = ""
        for paragraph in doc.paragraphs:
            content += paragraph.text + "\n"
        return content
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction DOCX: {str(e)}")
        return f"Erreur lors de la lecture du document Word: {str(e)}"

async def extract_csv_content(file_path: str) -> str:
    """Extrait le contenu d'un fichier CSV"""
    try:
        content = "Contenu du fichier CSV:\n\n"
        with open(file_path, 'r', encoding='utf-8', newline='') as csvfile:
            # Détecter le délimiteur
            sample = csvfile.read(1024)
            csvfile.seek(0)
            sniffer = csv.Sniffer()
            delimiter = sniffer.sniff(sample).delimiter
            
            reader = csv.reader(csvfile, delimiter=delimiter)
            rows = list(reader)
            
            if rows:
                headers = rows[0]
                content += f"Colonnes ({len(headers)}): {', '.join(headers)}\n\n"
                content += "Aperçu des données (10 premières lignes):\n"
                
                # Afficher les en-têtes
                content += "\t".join(headers) + "\n"
                content += "-" * 50 + "\n"
                
                # Afficher les données (max 10 lignes)
                for i, row in enumerate(rows[1:11]):
                    content += "\t".join(str(cell) for cell in row) + "\n"
                
                if len(rows) > 11:
                    content += f"\n... et {len(rows) - 11} autres lignes"
                    
                content += f"\n\nTotal: {len(rows) - 1} lignes de données"
            else:
                content += "Le fichier CSV est vide."
                
        return content
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction CSV: {str(e)}")
        return f"Erreur lors de la lecture du fichier CSV: {str(e)}"

async def extract_xlsx_content(file_path: str) -> str:
    """Extrait le contenu d'un fichier Excel"""
    try:
        # Pour l'instant, retourner un message indiquant que Excel n'est pas encore supporté
        # TODO: Implémenter l'extraction Excel avec openpyxl
        return f"Fichier Excel détecté: {os.path.basename(file_path)}\n\nNote: L'extraction du contenu des fichiers Excel sera implémentée dans une prochaine version. Pour l'instant, veuillez convertir votre fichier en CSV pour pouvoir l'analyser."
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction Excel: {str(e)}")
        return f"Erreur lors de la lecture du fichier Excel: {str(e)}"

async def extract_json_content(file_path: str) -> str:
    """Extrait le contenu d'un fichier JSON"""
    try:
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()
            # Valider et formater le JSON
            json_data = json.loads(content)
            return json.dumps(json_data, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction JSON: {str(e)}")
        return f"Erreur lors de la lecture du fichier JSON: {str(e)}"

async def extract_xml_content(file_path: str) -> str:
    """Extrait le contenu d'un fichier XML"""
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        
        def xml_to_text(element, level=0):
            text = "  " * level + f"<{element.tag}>"
            if element.text and element.text.strip():
                text += f" {element.text.strip()}"
            text += "\n"
            
            for child in element:
                text += xml_to_text(child, level + 1)
            
            return text
        
        return xml_to_text(root)
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction XML: {str(e)}")
        return f"Erreur lors de la lecture du fichier XML: {str(e)}"

def truncate_content(content: str, max_length: int = 8000) -> str:
    """
    Tronque le contenu si il est trop long pour l'API
    """
    if len(content) <= max_length:
        return content
    
    truncated = content[:max_length]
    return truncated + "\n\n[CONTENU TRONQUÉ - Le fichier est trop long pour être traité entièrement]"