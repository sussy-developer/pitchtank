"""
Role recommendation engine.
Uses LLM-suggested roles if available, otherwise infers from scores.
"""

_ALWAYS_NEEDED = ["Full-Stack Engineer", "Growth Marketer"]

_SCORE_ROLES = [
    ("tech",    ["scalability", "execution_risk"],  75, "Backend / DevOps Engineer"),
    ("market",  ["market_fit", "traction"],          65, "Sales & Business Development Lead"),
    ("finance", ["revenue_model"],                   65, "CFO / Financial Analyst"),
    ("brand",   ["competition"],                     70, "Brand Strategist"),
    ("data",    ["traction", "market_fit"],          72, "Data Analyst"),
    ("ops",     ["execution_risk"],                  60, "Operations Manager"),
    ("product", ["market_fit", "innovation"],        68, "Product Manager"),
]


def build(llm_roles: list | None, scores: dict) -> list[str]:
    if llm_roles and isinstance(llm_roles, list) and len(llm_roles) >= 3:
        return [str(r) for r in llm_roles[:6]]

    # Score-driven fallback
    roles = list(_ALWAYS_NEEDED)
    for _, keys, threshold, role in _SCORE_ROLES:
        avg = sum(scores.get(k, 60) for k in keys) / len(keys)
        if avg < threshold and role not in roles:
            roles.append(role)

    return roles[:6]
