import numpy as np

# Common/generic startup ideas used as the "similarity baseline"
# High cosine similarity → low innovation score
_GENERIC_IDEAS = [
    "food delivery app connecting restaurants with customers",
    "e-commerce marketplace for buying and selling products online",
    "social media platform for connecting people",
    "ride sharing app for urban transportation",
    "online learning platform with video courses",
    "project management tool for remote teams",
    "healthcare app for booking doctor appointments",
    "fintech app for digital payments and money transfers",
    "fitness tracking app with AI workout plans",
    "hotel and travel booking platform",
    "grocery delivery service from local stores",
    "freelance marketplace connecting clients with skilled workers",
    "music streaming subscription platform",
    "video content streaming platform",
    "real estate listing and property search platform",
    "job board and AI recruitment platform",
    "CRM software for small businesses",
    "accounting and invoicing SaaS for SMEs",
    "cloud storage and file sharing service",
    "on-demand home services booking app",
    "subscription box for curated products",
    "AI chatbot for customer support automation",
    "loyalty and rewards program platform",
    "used goods resale marketplace",
    "pet care services booking app",
]

_model = None
_index = None
_generic_embeddings = None


def _load():
    global _model, _index, _generic_embeddings
    if _model is not None:
        return

    import faiss
    from sentence_transformers import SentenceTransformer

    _model = SentenceTransformer("all-MiniLM-L6-v2")

    raw = _model.encode(_GENERIC_IDEAS, convert_to_numpy=True, show_progress_bar=False)
    norms = np.linalg.norm(raw, axis=1, keepdims=True)
    _generic_embeddings = (raw / norms).astype(np.float32)

    _index = faiss.IndexFlatIP(384)  # inner-product == cosine on unit vectors
    _index.add(_generic_embeddings)


def compute_innovation_score(idea_text: str) -> int:
    """
    Returns 30-95. High similarity to generic ideas → low score.
    embedding_score = 95 - similarity * 65
    """
    _load()

    from sentence_transformers import SentenceTransformer
    raw = _model.encode([idea_text[:512]], convert_to_numpy=True, show_progress_bar=False)
    norm = np.linalg.norm(raw, axis=1, keepdims=True)
    vec = (raw / norm).astype(np.float32)

    distances, _ = _index.search(vec, k=3)
    # distances[0][0] = highest cosine similarity among top-3 matches
    max_sim = float(np.clip(distances[0][0], 0.0, 1.0))

    score = int(95 - max_sim * 65)
    return max(30, min(95, score))
