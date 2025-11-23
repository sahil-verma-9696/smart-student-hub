import asyncio
from typing import List
from PIL import Image
import pytesseract
import fitz  # PyMuPDF
from fitz import Page
import docx
import shutil

from api.models import CertificateInfo


def _extract_text_from_pdf_sync(path: str) -> str:
    """Sync version of extract_text_from_pdf."""
    text = ""
    pdf = fitz.open(path)
    for page in pdf:
        text += page.get_text("text")  # type: ignore
    return text

async def extract_text_from_pdf(path: str) -> str:
    """Extract text from a PDF file."""
    return await asyncio.to_thread(_extract_text_from_pdf_sync, path)


def _extract_text_from_doc_sync(path: str) -> str:
    """Sync version of extract_text_from_doc."""
    doc = docx.Document(path)
    return "\n".join([p.text for p in doc.paragraphs])

async def extract_text_from_doc(path: str) -> str:
    """Extract text from a Word document."""
    return await asyncio.to_thread(_extract_text_from_doc_sync, path)


async def extract_text_from_image(path: str) -> str:
    """Extract text from an image using OCR."""
    if not shutil.which("tesseract"):
        raise RuntimeError("Tesseract is not installed or not in your PATH. Please install Tesseract to use OCR functionality.")
    return await asyncio.to_thread(pytesseract.image_to_string, Image.open(path))


async def extract_text_from_txt(path: str) -> str:
    """Extract text from a text file."""
    with open(path, "r") as f:
        return f.read()


async def process_certificates(certs: List[CertificateInfo]) -> List[dict]:
    """Process a list of certificates and extract their text."""
    output = []

    for cert in certs:
        content = ""
        try:
            if cert.type == "pdf":
                content = await extract_text_from_pdf(cert.path)
            elif cert.type == "doc":
                if cert.path.endswith(".doc"):
                    print(f"Warning: .doc files are not fully supported. Please convert {cert.path} to .docx for better results.")
                content = await extract_text_from_doc(cert.path)
            elif cert.type == "image":
                content = await extract_text_from_image(cert.path)
            elif cert.type == "txt":
                content = await extract_text_from_txt(cert.path)

            output.append({
                "path": cert.path,
                "type": cert.type,
                "content": content
            })
        except Exception as e:
            print(f"Error reading {cert.path}: {e}")

    return output