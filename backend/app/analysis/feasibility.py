"""
Feasibility (F)
Maps to UI criteria: Scalability + Execution Risk
Evaluates whether the idea can be built with current tech and whether cost/complexity are realistic.
"""


def compute(criteria_scores: dict) -> int:
    scalability = criteria_scores.get("scalability", 60)
    execution_risk = criteria_scores.get("execution_risk", 60)
    return int((scalability + execution_risk) / 2)
