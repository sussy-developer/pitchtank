"""
Insight generator.
Receives the raw LLM insights dict and ensures it has the right shape.
Falls back to score-driven generic insights if the LLM output is malformed.
"""


def _fallback_insights(scores: dict) -> dict:
    strengths, weaknesses, suggestions = [], [], []

    if scores.get("market_fit", 0) >= 70:
        strengths.append("Clear target market with demonstrated demand.")
    else:
        weaknesses.append("Target market definition needs sharper focus.")
        suggestions.append("Quantify your addressable market with data.")

    if scores.get("innovation", 0) >= 70:
        strengths.append("Differentiated approach with novel elements.")
    else:
        weaknesses.append("Idea overlaps heavily with existing solutions.")
        suggestions.append("Identify a specific pain point competitors have missed.")

    if scores.get("revenue_model", 0) >= 70:
        strengths.append("Monetization strategy is clear and realistic.")
    else:
        weaknesses.append("Revenue model lacks clarity or scalability.")
        suggestions.append("Define unit economics — CAC, LTV, and payback period.")

    if scores.get("scalability", 0) < 65:
        weaknesses.append("Scalability path is unclear or technically complex.")
        suggestions.append("Describe how you scale from 100 to 100,000 users.")

    if scores.get("traction", 0) < 60:
        weaknesses.append("No evidence of early validation or customer traction.")
        suggestions.append("Add letters of intent, pilot users, or waitlist numbers.")

    return {
        "strengths": strengths[:3] or ["Concept addresses a real problem."],
        "weaknesses": weaknesses[:3] or ["Execution path needs more detail."],
        "suggestions": suggestions[:3] or ["Strengthen pitch with market data and metrics."],
    }


def build(llm_insights: dict | None, scores: dict) -> dict:
    if not llm_insights or not isinstance(llm_insights, dict):
        return _fallback_insights(scores)

    def _clean(lst, default):
        if isinstance(lst, list) and lst:
            return [str(x) for x in lst[:3]]
        return [default]

    return {
        "strengths": _clean(llm_insights.get("strengths"), "Strong pitch foundation."),
        "weaknesses": _clean(llm_insights.get("weaknesses"), "Needs deeper market analysis."),
        "suggestions": _clean(llm_insights.get("suggestions"), "Refine with real data and metrics."),
    }
