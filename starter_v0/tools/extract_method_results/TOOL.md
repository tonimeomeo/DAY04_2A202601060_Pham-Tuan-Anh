---
name: extract_method_results
track: bonus
kind: local_extract
provider: regex_nlp
requires_env: []
inputs: [txt_path, raw_text]
outputs: [abstract, methodology, results, conclusion, section_found]
side_effect: false
requires_confirmation: false
---
# extract_method_results

Parses extracted paper text (from a `.txt` file or raw text string) and extracts key sections: Abstract, Methodology/Method, Experiments/Results, and Conclusion using regex section matching.
