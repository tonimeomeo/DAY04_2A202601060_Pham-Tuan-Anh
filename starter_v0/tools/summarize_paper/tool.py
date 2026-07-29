from __future__ import annotations

from typing import Any

from tools._shared import err


def summarize_paper(
    title: str = "",
    authors: list[str] | str | None = None,
    year: str = "",
    abstract: str = "",
    methodology: str = "",
    results: str = "",
) -> dict[str, Any]:
    """
    Combines extracted components of a research paper into a structured Markdown digest.
    """
    try:
        authors_str = ", ".join(authors) if isinstance(authors, list) else (authors or "Unknown")
        title_str = title or "Untitled Research Paper"

        report_lines = [
            f"# 📄 Research Paper Scout Report: {title_str}",
            f"**Tác giả:** {authors_str} | **Năm:** {year or 'N/A'}",
            "",
            "## 💡 1. Tóm tắt tổng quan (Abstract)",
            abstract.strip() if abstract else "Chưa có nội dung abstract.",
            "",
            "## ⚙️ 2. Phương pháp nghiên cứu (Methodology & Architecture)",
            methodology.strip() if methodology else "Chưa trích xuất được phần phương pháp chi tiết.",
            "",
            "## 📊 3. Kết quả & Đánh giá (Results & Evaluation)",
            results.strip() if results else "Chưa trích xuất được phần kết quả thực nghiệm chi tiết.",
            "",
            "---",
            "*Báo cáo được tổng hợp tự động bởi Research Paper Scout Agent.*",
        ]

        markdown_report = "\n".join(report_lines)

        return {
            "tool": "summarize_paper",
            "title": title_str,
            "authors": authors_str,
            "markdown_report": markdown_report,
        }
    except Exception as exc:
        return err("summarize_paper", exc)
