from __future__ import annotations

import re
from typing import Any

from tools._shared import err


def _score_paper(paper: dict[str, Any], query_terms: list[str]) -> float:
    score = 0.0
    title = (paper.get("title") or "").lower()
    summary = (paper.get("summary") or "").lower()

    for term in query_terms:
        if term in title:
            score += 3.0
        if term in summary:
            score += 1.0

    # Bonus for citation count (credibility metric)
    citations = paper.get("citations_count", 0) or 0
    if citations > 1000:
        score += 2.0
    elif citations > 100:
        score += 1.0
    elif citations > 10:
        score += 0.5

    # Slight bonus for recent publications
    published = str(paper.get("published") or "")
    if "2024" in published or "2025" in published or "2026" in published:
        score += 0.5

    return round(score, 2)


def rank_papers(papers: list[dict[str, Any]] | None = None, query: str = "", top_k: int = 3) -> dict[str, Any]:
    """
    Ranks and filters a list of paper search results based on relevance to query.
    """
    try:
        candidate_papers = papers or []
        query_terms = [t.lower() for t in re.findall(r"\w+", query or "") if len(t) > 2]
        top_k = max(1, min(int(top_k or 3), 10))

        scored: list[dict[str, Any]] = []
        for paper in candidate_papers:
            s = _score_paper(paper, query_terms)
            scored.append({
                "arxiv_id": paper.get("arxiv_id", ""),
                "title": paper.get("title", ""),
                "authors": paper.get("authors", []),
                "published": paper.get("published", ""),
                "citations_count": paper.get("citations_count", 0),
                "url": paper.get("url", ""),
                "pdf_url": paper.get("pdf_url", paper.get("url", "")),
                "summary": paper.get("summary", "")[:300],
                "relevance_score": s,
            })

        # Sort descending by relevance score
        scored.sort(key=lambda x: x["relevance_score"], reverse=True)
        ranked = scored[:top_k]

        return {
            "tool": "rank_papers",
            "query": query,
            "total_input": len(candidate_papers),
            "top_k": top_k,
            "ranked_papers": ranked,
        }
    except Exception as exc:
        return err("rank_papers", exc)
