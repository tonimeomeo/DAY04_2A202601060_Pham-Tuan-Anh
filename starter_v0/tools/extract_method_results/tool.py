from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from tools._shared import err


def _split_into_sections(text: str) -> dict[str, str]:
    """Parse text into major paper sections using heading patterns."""
    patterns = {
        "abstract": r"(?i)(?:^|\n)(?:abstract|tóm tắt)[\s:]*(.+?)(?=\n\s*(?:1\.?\s*|i\.?\s*)?(?:introduction|giới thiệu|background)|$)",
        "methodology": r"(?i)(?:^|\n)(?:[0-9IVX]+\.?\s*)?(?:methodology|methods|proposed method|approach|framework|architecture|phương pháp)[\s:]*(.+?)(?=\n\s*(?:[0-9IVX]+\.?\s*)?(?:experiments|results|evaluation|experiments and results|kết quả)|$)",
        "results": r"(?i)(?:^|\n)(?:[0-9IVX]+\.?\s*)?(?:experiments|results|evaluation|experimental results|discussion|kết quả|thử nghiệm)[\s:]*(.+?)(?=\n\s*(?:[0-9IVX]+\.?\s*)?(?:conclusion|related work|future work|references|kết luận)|$)",
        "conclusion": r"(?i)(?:^|\n)(?:[0-9IVX]+\.?\s*)?(?:conclusion|concluding remarks|kết luận)[\s:]*(.+?)(?=\n\s*(?:references|acknowledgments|phụ lục)|$)",
    }

    extracted: dict[str, str] = {}
    for section_name, pattern in patterns.items():
        match = re.search(pattern, text, re.DOTALL)
        if match:
            extracted[section_name] = match.group(1).strip()[:4000]
        else:
            extracted[section_name] = ""

    # Fallback heuristic if methodology/results sections were not matched explicitly by regex
    if not extracted["methodology"] and not extracted["results"]:
        lines = text.split("\n")
        total_len = len(lines)
        if total_len > 10:
            # First third ~ abstract/intro, second third ~ methodology, final third ~ results/conclusion
            one_third = total_len // 3
            two_third = (total_len * 2) // 3
            extracted["methodology"] = "\n".join(lines[one_third:two_third]).strip()[:3000]
            extracted["results"] = "\n".join(lines[two_third:]).strip()[:3000]

    return extracted


def extract_method_results(txt_path: str = "", raw_text: str = "") -> dict[str, Any]:
    """
    Extracts Methodology and Results sections from paper text or text file.
    """
    try:
        content = raw_text or ""
        if txt_path and not content:
            path = Path(txt_path)
            if not path.is_absolute():
                path = Path.cwd() / path
            if path.exists():
                content = path.read_text(encoding="utf-8", errors="ignore")
            else:
                return {"tool": "extract_method_results", "error": f"File not found: {txt_path}"}

        if not content.strip():
            return {"tool": "extract_method_results", "error": "No content provided to extract sections."}

        sections = _split_into_sections(content)

        return {
            "tool": "extract_method_results",
            "sections_found": [k for k, v in sections.items() if len(v) > 50],
            "abstract": sections.get("abstract", "")[:1500],
            "methodology": sections.get("methodology", "")[:3000],
            "results": sections.get("results", "")[:3000],
            "conclusion": sections.get("conclusion", "")[:1500],
            "methodology_length": len(sections.get("methodology", "")),
            "results_length": len(sections.get("results", "")),
        }
    except Exception as exc:
        return err("extract_method_results", exc)
