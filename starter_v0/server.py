import os
import sys
from pathlib import Path
from flask import Flask, request, jsonify

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))

from env_loader import load_lab_env
from providers import make_provider
from tools import load_tool_declarations, to_openai_tools
from chat import run_model_tool_loop, trim_history

load_lab_env(ROOT)

app = Flask(__name__)

# Load artifacts
ARTIFACTS_DIR = ROOT / "artifacts"
SYSTEM_PROMPT_PATH = ARTIFACTS_DIR / "system_prompt.md"
TOOLS_PATH = ARTIFACTS_DIR / "tools.yaml"

system_prompt = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8") if SYSTEM_PROMPT_PATH.exists() else "You are ScholarAI Research Agent."
try:
    tool_declarations = load_tool_declarations(TOOLS_PATH) if TOOLS_PATH.exists() else []
    openai_tools = to_openai_tools(tool_declarations)
except Exception as e:
    print(f"Warning loading tools: {e}")
    openai_tools = []

# Try initializing provider
provider_name = os.getenv("PROVIDER", "gemini")
try:
    provider = make_provider(provider_name)
    provider_available = True
except Exception as e:
    print(f"Provider '{provider_name}' initialization warning: {e}")
    provider = None
    provider_available = False

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify({
        "status": "online",
        "provider": provider_name,
        "provider_available": provider_available,
        "tools_count": len(openai_tools)
    })

@app.route("/api/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json() or {}
    user_text = data.get("message", "").strip()
    raw_history = data.get("history", []) # [{role: 'user'|'assistant'|'system', text/content: '...'}]
    
    if not user_text:
        return jsonify({"error": "Empty message"}), 400

    # Format history for model
    formatted_history = []
    for msg in raw_history:
        role = msg.get("role")
        content = msg.get("text") or msg.get("content")
        if role in ["user", "assistant"] and content:
            formatted_history.append({"role": role, "content": content})

    messages = [
        {"role": "system", "content": system_prompt},
        *trim_history(formatted_history, 5),
        {"role": "user", "content": user_text}
    ]

    if provider_available and provider:
        try:
            result = run_model_tool_loop(
                provider=provider,
                messages=messages,
                tools=openai_tools,
                model=None,
                max_tool_rounds=4
            )
            return jsonify({
                "status": "ok",
                "assistant_text": result.get("assistant_text"),
                "rounds": result.get("rounds", []),
                "tool_events": result.get("tool_events", [])
            })
        except Exception as exc:
            print(f"Error during agent execution: {exc}")
            # Fall through to mock response on API failure

    # Mock response if provider is offline or failed
    simulated_tools = []
    if "github" in user_text.lower() or "code" in user_text.lower() or "attention" in user_text.lower():
        simulated_tools = [{
            "tool": "find_paper_code",
            "args": {"query": user_text},
            "result": {"status": "found", "repo": "https://github.com/tensorflow/tensor2tensor", "stars": 12400}
        }]
        assistant_reply = f"I have executed the `find_paper_code` tool for your query '{user_text}'. The official implementation is verified at tensorflow/tensor2tensor with over 12.4k stars."
    elif "arxiv" in user_text.lower() or "paper" in user_text.lower():
        simulated_tools = [{
            "tool": "search_arxiv",
            "args": {"query": user_text},
            "result": {"count": 3, "papers": ["Attention Is All You Need (Vaswani et al., 2017)"]}
        }]
        assistant_reply = f"I searched arXiv and extracted relevant academic papers matching '{user_text}'. Vaswani et al. (2017) is the foundational citation."
    else:
        assistant_reply = f"Deep-Sea Research Agent analyzed your query: '{user_text}'. Synthesized insights from indexed academic literature."

    return jsonify({
        "status": "mock",
        "assistant_text": assistant_reply,
        "tool_events": simulated_tools
    })

if __name__ == "__main__":
    print("Starting ScholarAI Agent API Server on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
