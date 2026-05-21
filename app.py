"""
app.py
──────
Flask backend for the multilingual voice chat app.

Routes:
  GET  /           → serves the main HTML page
  GET  /languages  → returns supported language config (for frontend)
  POST /chat       → sends a message to Claude, returns the reply

Run:
  pip install -r requirements.txt
  python app.py
"""

import truststore
truststore.inject_into_ssl()

import os
import json
from pathlib import Path
from flask import Flask, request, jsonify, render_template
from anthropic import Anthropic
from dotenv import load_dotenv
from prompts import SYSTEM_PROMPT, MODEL, MAX_TOKENS, LANGUAGES, detect_language

# ── Load environment variables from .env ───────────────────────────────────
load_dotenv(Path(__file__).parent / ".env", override=True)

# ── Flask app setup ────────────────────────────────────────────────────────
app = Flask(__name__)

# ── Anthropic client ───────────────────────────────────────────────────────
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key or api_key.startswith("sk-ant-api03-your"):
    raise EnvironmentError(
        "\n\n  ❌  ANTHROPIC_API_KEY is not set.\n"
        "  Open .env and replace the placeholder with your real API key.\n"
        "  Get one at: https://console.anthropic.com\n"
    )

client = Anthropic(api_key=api_key)


# ── Routes ─────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Serve the main chat page."""
    return render_template("index.html")


@app.route("/languages")
def get_languages():
    """
    Return supported language config to the frontend.
    Keeps language data in one place (prompts.py) rather than duplicating it in JS.
    """
    return jsonify(LANGUAGES)


@app.route("/chat", methods=["POST"])
def chat():
    """
    Accept a conversation history from the frontend,
    send it to Claude, and return the AI reply.

    Expected JSON body:
    {
      "messages": [
        { "role": "user",      "content": "Hello!" },
        { "role": "assistant", "content": "Hi there!" },
        ...
      ]
    }

    Response JSON:
    {
      "reply":    "The AI's response text",
      "lang":     "en",    ← detected language code
      "langInfo": { "label": "EN", "flag": "🇬🇧", ... }
    }
    """
    data = request.get_json(silent=True)

    # ── Validate input ──
    if not data or "messages" not in data:
        return jsonify({"error": "Request body must include a 'messages' array."}), 400

    messages = data["messages"]

    if not isinstance(messages, list) or len(messages) == 0:
        return jsonify({"error": "'messages' must be a non-empty array."}), 400

    # ── Call Claude ──
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 502

    reply = response.content[0].text if response.content else "…"

    # ── Detect language of the reply for the frontend ──
    lang_code = detect_language(reply)
    lang_info = LANGUAGES.get(lang_code, LANGUAGES["en"])

    return jsonify({
        "reply":    reply,
        "lang":     lang_code,
        "langInfo": lang_info,
    })


# ── Entry point ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port  = int(os.getenv("FLASK_PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"

    print(f"\n  VoiceChat is running -> http://localhost:{port}\n")
    app.run(host="0.0.0.0", port=port, debug=debug)
