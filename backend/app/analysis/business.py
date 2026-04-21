"""
Business Model (B)
Maps to UI criteria: Revenue Model
Evaluates revenue clarity, scalability of the model, and monetization strategy.
"""


def compute(criteria_scores: dict) -> int:
    return criteria_scores.get("revenue_model", 60)
