# VoiceChat — Multilingual AI Voice Assistant

Speak or type in **English, Spanish, French, or Chinese** — Claude replies in the same language, both in text and voice.

---

## Quick Start

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | 3.9 or higher | [python.org](https://python.org) |
| Browser | Chrome or Edge | Required for voice input (STT) |
| Anthropic API key | — | [console.anthropic.com](https://console.anthropic.com) |

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/Afreen2907/multilingual-voice-chat-py.git
cd multilingual-voice-chat-py
```

---

### Step 2 — Add your API key

Copy the example env file and fill in your key:

```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Open `.env` and replace the placeholder:

```
ANTHROPIC_API_KEY=sk-ant-api03-your-real-key-here
```

Get a key at → [console.anthropic.com](https://console.anthropic.com)

---

### Step 3 — Run (single command)

**Windows:**
```bat
start.bat
```

**Mac / Linux:**
```bash
pip install -r requirements.txt && python app.py
```

Open your browser → **http://localhost:5000**

That's it. The script installs all dependencies and starts the server automatically.

---

## Project Structure

```
multilingual-voice-chat-py/
│
├── app.py               ← Flask server: routes + Anthropic API calls
├── prompts.py           ← AI prompt, model config, language definitions
├── start.bat            ← Windows one-command launcher
│
├── .env                 ← Your secret API key (never committed)
├── .env.example         ← Template — copy to .env to get started
├── requirements.txt     ← Python dependencies
│
├── templates/
│   └── index.html       ← Main chat page (served by Flask)
│
└── static/
    ├── css/
    │   └── style.css    ← All styles
    └── js/
        ├── app.js       ← Main controller: fetch /chat, manage history
        ├── speech.js    ← Mic input (STT) + voice output (TTS)
        └── ui.js        ← DOM updates: bubbles, status bar, inputs
```

---

## How It Works

```
User speaks  →  Web Speech API (STT)  →  POST /chat  →  Claude  →  reply text
reply text   →  Web Speech API (TTS)  →  spoken aloud
```

- The **API key never touches the browser** — it stays in `.env` on your machine.
- **Language detection** runs server-side in `prompts.py → detect_language()`.
- **Language config** is served via `GET /languages` so it's defined in one place only.

---

## Supported Languages

| Language | Code | Flag | Voice (BCP-47) |
|----------|------|------|----------------|
| English  | `en` | 🇬🇧 | `en-US`        |
| Spanish  | `es` | 🇪🇸 | `es-ES`        |
| French   | `fr` | 🇫🇷 | `fr-FR`        |
| Chinese (Simplified) | `zh` | 🇨🇳 | `zh-CN` |

---

## Customisation

All AI-related settings live in **`prompts.py`**:

| What to change | Where in prompts.py |
|----------------|---------------------|
| AI behaviour / tone | `SYSTEM_PROMPT` |
| AI model | `MODEL` |
| Max reply length | `MAX_TOKENS` |
| Add a new language | `LANGUAGES` + `DETECTION_RULES` |

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Serves the chat page |
| `GET` | `/languages` | Returns supported language config (JSON) |
| `POST` | `/chat` | Accepts messages array, returns AI reply |

### POST /chat — example request

```json
{
  "messages": [
    { "role": "user", "content": "你好，今天怎么样？" }
  ]
}
```

### POST /chat — example response

```json
{
  "reply":    "你好！我很好，谢谢你问。你今天怎么样？",
  "lang":     "zh",
  "langInfo": { "label": "ZH", "flag": "CN", "name": "中文", "bcp47": "zh-CN", "voicePrefix": "zh" }
}
```

---

## Browser Support

| Browser | Voice Input (STT) | Voice Output (TTS) |
|---------|-------------------|--------------------|
| Chrome  | Best | Best |
| Edge    | Good | Good |
| Firefox | No STT | TTS only |
| Safari  | Limited | Good |

**Use Chrome for the best experience.**

---

## Troubleshooting

### SSL / Certificate error (corporate networks)

If you see `CERTIFICATE_VERIFY_FAILED`, your network uses SSL inspection. This is already handled by the `truststore` package in `requirements.txt`, which makes Python use your OS certificate store. Just make sure it is installed:

```bash
pip install truststore
```

### No voice output for Chinese

The browser needs a Chinese TTS voice installed on your OS.

**Windows:**
1. Settings → Time & Language → Language & Region
2. Add language → **Chinese (Simplified, China)**
3. Make sure **Text-to-speech** is checked during install
4. Restart Chrome

### Low Anthropic API credits

If you see a `400` credit error in the terminal, top up your balance at [console.anthropic.com/settings/billing](https://console.anthropic.com/settings/billing).
