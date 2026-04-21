"""
Market Fit (M)
Maps to UI criteria: Market Fit + Traction
Evaluates whether there is a clear target audience and demonstrated demand.
"""


def compute(criteria_scores: dict) -> int:
    market_fit = criteria_scores.get("market_fit", 60)
    traction = criteria_scores.get("traction", 60)
    return int((market_fit + traction) / 2)
