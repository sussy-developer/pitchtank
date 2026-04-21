"""
Innovation (I)
Blends LLM score with embedding-based similarity score.
High similarity to generic startup ideas → lower innovation score.
"""


def compute(criteria_scores: dict, embedding_score: int | None = None) -> int:
    llm_score = criteria_scores.get("innovation", 60)
    if embedding_score is not None:
        # 60% LLM judgement, 40% embedding inverse-similarity
        blended = int(llm_score * 0.60 + embedding_score * 0.40)
        return max(10, min(100, blended))
    return llm_score
