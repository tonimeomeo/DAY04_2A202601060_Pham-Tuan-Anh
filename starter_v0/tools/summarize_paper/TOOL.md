---
name: summarize_paper
track: bonus
kind: local_formatter
provider: local_formatter
requires_env: []
inputs: [title, authors, year, abstract, methodology, results]
outputs: [formatted_summary, markdown_report]
side_effect: false
requires_confirmation: false
---
# summarize_paper

Formats extracted research paper sections (Abstract, Methodology, Results) into a clean Markdown research summary report.
