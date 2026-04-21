import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.pipeline.orchestrator import run_pipeline

app = FastAPI(title="PitchTank AI Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
async def analyze_pitch(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    pdf_bytes = await file.read()
    if len(pdf_bytes) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 20MB)")
    if len(pdf_bytes) < 100:
        raise HTTPException(status_code=400, detail="File appears to be empty")

    result = await run_pipeline(pdf_bytes, file.filename)
    return result


@app.get("/health")
async def health():
    return {"status": "ok", "llm_provider": os.getenv("LLM_PROVIDER", "gemini")}
