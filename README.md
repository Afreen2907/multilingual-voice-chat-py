# VoiceChat — Multilingual AI Voice Assistant (Python + Flask)

Speak in **English, Spanish, or French** — the AI replies in the same language, both in text and voice.

---

## Project Structure

```
multilingual-voice-chat/
│
├── app.py                   ← Flask server: routes + Anthropic API calls
├── prompts.py               ← ALL AI prompt data: system prompt, model, languages, detection rules
│
├── .env                     ← Your secret API key (never commit this)
├── .env.example             ← Template — copy to .env to get started
├── requirements.txt         ← Python dependencies
│
├── templates/
│   └── index.html           ← HTML page served by Flask
│
└── static/
    ├── css/
    │   └── style.css        ← All styles
    └── js/
        ├── ui.js            ← DOM updates (bubbles, status, inputs)
        ├── speech.js        ← Mic input (STT) + voice output (TTS)
        └── app.js           ← Main controller, calls /chat and /languages
```

---

## Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure your API key

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-real-key-here
```

Get a key at → https://console.anthropic.com

### 3. Run the server

```bash
python app.py
```

Open your browser → **http://localhost:5000**

---

## How It Works

```
Browser mic  →  Web Speech API (STT)  →  POST /chat  →  Claude Haiku  →  reply text
reply text   →  Web Speech API (TTS)  →  spoken aloud
```

- The **API key never touches the browser** — it stays in `.env` on your machine.
- Language detection runs on the server (`prompts.py → detect_language()`).
- Language config (`LANGUAGES`) is loaded by the frontend via `GET /languages` so it's defined in one place only.

---

## Customisation

All AI-related settings live in **`prompts.py`**:

| What to change         | Where in prompts.py        |
|------------------------|----------------------------|
| AI behaviour / tone    | `SYSTEM_PROMPT`            |
| AI model               | `MODEL`                    |
| Max reply length       | `MAX_TOKENS`               |
| Add a new language     | `LANGUAGES` + `DETECTION_RULES` |

---

## API Endpoints

| Method | Route        | Description                              |
|--------|--------------|------------------------------------------|
| GET    | `/`          | Serves the chat page                     |
| GET    | `/languages` | Returns supported language config (JSON) |
| POST   | `/chat`      | Accepts messages array, returns AI reply |

### POST /chat — example request

```json
{
  "messages": [
    { "role": "user", "content": "Bonjour, comment ça va?" }
  ]
}
```

### POST /chat — example response

```json
{
  "reply":    "Bonjour ! Je vais très bien, merci. Et vous ?",
  "lang":     "fr",
  "langInfo": { "label": "FR", "flag": "🇫🇷", "name": "Français", "bcp47": "fr-FR", "voicePrefix": "fr" }
}
```

---

## Browser Support

| Browser | Voice Input (STT) | Voice Output (TTS) |
|---------|-------------------|--------------------|
| Chrome  | ✅ Best           | ✅ Best             |
| Edge    | ✅ Good           | ✅ Good             |
| Firefox | ❌ No STT         | ✅ TTS only         |
| Safari  | ⚠️ Limited        | ✅ Good             |

**Use Chrome for the best demo experience.**
