"""
Weighted scoring engine.

Formula: FinalScore = 0.25*L + 0.20*I + 0.20*F + 0.20*M + 0.15*B

Where:
  L = Logical Consistency  (competition + team_strength) / 2
  I = Innovation           blended LLM + embedding score
  F = Feasibility          (scalability + execution_risk) / 2
  M = Market Fit           (market_fit + traction) / 2
  B = Business Model       revenue_model
"""


def compute_final_score(L: int, I: int, F: int, M: int, B: int) -> int:
    raw = 0.25 * L + 0.20 * I + 0.20 * F + 0.20 * M + 0.15 * B
    return max(0, min(100, int(round(raw))))


def build_criteria_list(scores: dict) -> list[dict]:
    """Map raw LLM scores to the 8-item criteria list the UI expects."""
    mapping = [
        ("Market Fit",      "🎯", "market_fit"),
        ("Innovation",      "💡", "innovation"),
        ("Scalability",     "📈", "scalability"),
        ("Revenue Model",   "💰", "revenue_model"),
        ("Competition",     "⚔️",  "competition"),
        ("Team Strength",   "👥", "team_strength"),
        ("Execution Risk",  "⚡", "execution_risk"),
        ("Traction",        "🚀", "traction"),
    ]
    return [
        {"label": label, "icon": icon, "score": int(scores.get(key, 60))}
        for label, icon, key in mapping
    ]
