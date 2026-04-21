"""
Main pipeline orchestrator.
1. Extract text from PDF
2. Call LLM for structured evaluation (one call, all criteria)
3. Blend innovation score with embedding similarity
4. Apply weighted scoring formula
5. Return structured response matching the UI's expected shape
"""
import asyncio
from typing import Any

from app.pdf.extractor import extract_text
from app.services.llm_service import call_llm, parse_json_response
from app.ai.embedding_service import compute_innovation_score
from app.analysis import logical, innovation, feasibility, market, business
from app.scoring.engine import compute_final_score, build_criteria_list
from app.insights.generator import build as build_insights
from app.recommendation.roles import build as build_roles

_PROMPT_TEMPLATE = """You are an expert startup investor and pitch-deck analyst.

Analyze the startup pitch deck text below and return a single JSON object — no markdown, no explanation, only raw JSON.

PITCH DECK TEXT (first 6000 chars):
{text}

Return EXACTLY this JSON structure:
{{
  "structured_data": {{
    "problem": "<one sentence: the problem being solved>",
    "solution": "<one sentence: the proposed solution>",
    "target_market": "<specific audience and market>",
    "revenue_model": "<how the company earns money>",
    "technology": "<key tech or technical approach>"
  }},
  "criteria_scores": {{
    "market_fit": <integer 0-100>,
    "innovation": <integer 0-100>,
    "scalability": <integer 0-100>,
    "revenue_model": <integer 0-100>,
    "competition": <integer 0-100>,
    "team_strength": <integer 0-100>,
    "execution_risk": <integer 0-100>,
    "traction": <integer 0-100>
  }},
  "insights": {{
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
    "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
  }},
  "roles": ["<Role 1>", "<Role 2>", "<Role 3>", "<Role 4>", "<Role 5>"]
}}

Scoring rubric (be critical, realistic — 55-85 is the normal range for a decent pitch):
- market_fit: Clarity of target audience, evidence of demand, problem-solution fit
- innovation: Uniqueness vs existing solutions (30=very generic, 90=highly novel)
- scalability: Technical feasibility, infrastructure, growth headroom
- revenue_model: Monetization clarity, unit economics, sustainability
- competition: Strength of moat, differentiation, competitive advantage
- team_strength: Implied execution capability inferred from pitch quality
- execution_risk: HIGHER score = LOWER risk (clear roadmap = 80+, vague = 40-)
- traction: Validation evidence — users, pilots, LOIs, metrics mentioned

If the pitch text is empty or too short to evaluate, return scores of 40 across all criteria."""


def _safe_int(val: Any, default: int = 60) -> int:
    try:
        return max(0, min(100, int(val)))
    except (TypeError, ValueError):
        return default


async def run_pipeline(pdf_bytes: bytes, filename: str) -> dict:
    # --- 1. Extract text ---
    loop = asyncio.get_event_loop()
    text = await loop.run_in_executor(None, extract_text, pdf_bytes)

    if not text or len(text.strip()) < 50:
        text = f"[Pitch deck: {filename}. Text could not be extracted — may be image-based or scanned.]"

    # --- 2. LLM analysis + embedding innovation score (run concurrently) ---
    prompt = _PROMPT_TEMPLATE.format(text=text[:6000])

    llm_task = loop.run_in_executor(None, call_llm, prompt)
    idea_snippet = text[:512]
    embed_task = loop.run_in_executor(None, compute_innovation_score, idea_snippet)

    llm_raw, embed_score = await asyncio.gather(llm_task, embed_task)

    # --- 3. Parse LLM response ---
    try:
        parsed = parse_json_response(llm_raw)
    except ValueError:
        parsed = {}

    raw_scores: dict = parsed.get("criteria_scores", {})

    criteria_scores = {
        "market_fit":      _safe_int(raw_scores.get("market_fit"),      60),
        "innovation":      _safe_int(raw_scores.get("innovation"),       60),
        "scalability":     _safe_int(raw_scores.get("scalability"),      60),
        "revenue_model":   _safe_int(raw_scores.get("revenue_model"),    60),
        "competition":     _safe_int(raw_scores.get("competition"),      60),
        "team_strength":   _safe_int(raw_scores.get("team_strength"),    60),
        "execution_risk":  _safe_int(raw_scores.get("execution_risk"),   60),
        "traction":        _safe_int(raw_scores.get("traction"),         60),
    }

    # --- 4. Blend innovation score with embedding ---
    blended_innovation = innovation.compute(criteria_scores, embed_score)
    criteria_scores["innovation"] = blended_innovation

    # --- 5. Compute analytical component scores ---
    L = logical.compute(criteria_scores)
    I = blended_innovation
    F = feasibility.compute(criteria_scores)
    M = market.compute(criteria_scores)
    B = business.compute(criteria_scores)

    final_score = compute_final_score(L, I, F, M, B)

    # --- 6. Build UI criteria list ---
    criteria_list = build_criteria_list(criteria_scores)

    # --- 7. Insights + roles ---
    insights = build_insights(parsed.get("insights"), criteria_scores)
    roles = build_roles(parsed.get("roles"), criteria_scores)

    # --- 8. Structured data ---
    raw_sd = parsed.get("structured_data", {})
    structured_data = {
        "problem":       str(raw_sd.get("problem",       "Not identified")),
        "solution":      str(raw_sd.get("solution",      "Not identified")),
        "target_market": str(raw_sd.get("target_market", "Not identified")),
        "revenue_model": str(raw_sd.get("revenue_model", "Not identified")),
        "technology":    str(raw_sd.get("technology",    "Not identified")),
    }

    return {
        "criteria":        criteria_list,   # 8 items — used by UI animation
        "overall":         final_score,     # 0-100 — used by UI
        "structured_data": structured_data,
        "scores": {                         # analytical breakdown
            "logical":     L,
            "innovation":  I,
            "feasibility": F,
            "market":      M,
            "business":    B,
        },
        "final_score": final_score,
        "roles":    roles,
        "insights": insights,
    }
