import re
from io import BytesIO
import pdfplumber


def extract_text(pdf_bytes: bytes) -> str:
    text_parts = []
    with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    raw = "\n".join(text_parts)
    return _clean(raw)


def _clean(text: str) -> str:
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Remove non-printable characters except newlines
    text = re.sub(r"[^\x20-\x7E\n]", " ", text)
    text = re.sub(r" {3,}", " ", text)
    return text.strip()
