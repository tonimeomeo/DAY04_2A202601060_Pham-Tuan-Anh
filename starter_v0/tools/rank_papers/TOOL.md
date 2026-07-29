---
name: rank_papers
track: bonus
kind: local_formatter
provider: local_algorithm
requires_env: []
inputs: [papers, query, top_k]
outputs: [ranked_papers, total_input]
side_effect: false
requires_confirmation: false
---
# rank_papers

Ranks and filters a list of paper search results based on relevance score, title match, and abstract key concepts relative to a research query.
