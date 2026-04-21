"""
Logical Consistency (L)
Maps to UI criteria: Competition + Team Strength
Checks whether the solution directly addresses the problem and the reasoning is coherent.
"""


def compute(criteria_scores: dict) -> int:
    competition = criteria_scores.get("competition", 60)
    team_strength = criteria_scores.get("team_strength", 60)
    return int((competition + team_strength) / 2)
