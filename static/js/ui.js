/**
 * ui.js
 * All DOM updates: chat bubbles, status bar, transcript box, inputs.
 * No API or speech logic here — pure UI layer.
 */

const UI = (() => {

  // ── Element helpers ────────────────────────────────────────────────────
  const el = (id) => document.getElementById(id);

  // ── Language badges (populated from /languages on load) ───────────────
  function renderLangBadges(languages) {
    const container  = el('lang-badges');
    const hint       = el('empty-hint');
    const namesList  = Object.values(languages).map(l => `<strong>${l.flag} ${l.name}</strong>`).join(', ');

    container.innerHTML = Object.values(languages)
      .map(l => `<span class="badge">${l.flag} ${l.name}</span>`)
      .join('');

    if (hint) {
      hint.innerHTML = `Press the mic or type in<br>${namesList}<br>— the AI replies in the same language.`;
    }
  }

  // ── Status Bar ─────────────────────────────────────────────────────────
  function setStatus(type, message) {
    const s = el('status-bar');
    s.className   = type;   // '' | 'thinking' | 'speaking' | 'error'
    s.textContent = message;
  }

  // ── Transcript Box ─────────────────────────────────────────────────────
  function setTranscript(text, state = '') {
    const t = el('transcript-box');
    t.textContent = text;
    t.className   = state;  // '' | 'active' | 'listening'
  }

  // ── Mic Button ─────────────────────────────────────────────────────────
  function setMicRecording(isRecording) {
    const btn = el('mic-btn');
    btn.classList.toggle('recording', isRecording);
    btn.textContent = isRecording ? '⏹️' : '🎤';
  }

  // ── Inputs ─────────────────────────────────────────────────────────────
  function setInputsDisabled(disabled) {
    el('mic-btn').disabled   = disabled;
    el('send-btn').disabled  = disabled;
    el('text-input').disabled = disabled;
  }

  function getTextInputValue()  { return el('text-input').value.trim(); }
  function clearTextInput()     { el('text-input').value = ''; }

  // ── Settings ───────────────────────────────────────────────────────────
  function getVoiceSpeed() { return parseFloat(el('speed-select').value); }
  function getAutoSpeak()  { return el('autospeak-select').value === 'yes'; }

  // ── Chat Bubbles ───────────────────────────────────────────────────────
  /**
   * Add a message bubble to the chat window.
   * @param {'user'|'ai'} role
   * @param {string}      text
   * @param {object}      langInfo  — { flag, label, ... } from /languages
   * @param {Function}    [onPlay]  — callback for play button (AI only)
   * @returns {HTMLElement}
   */
  function addBubble(role, text, langInfo, onPlay) {
    // Remove empty state on first message
    el('empty-state')?.remove();

    const win = el('chat-window');

    const div = document.createElement('div');
    div.className = `msg ${role}`;

    const bubble = document.createElement('div');
    bubble.className   = 'bubble';
    bubble.textContent = text;

    const meta = document.createElement('div');
    meta.className = 'msg-meta';

    const tag = document.createElement('span');
    tag.className   = 'lang-tag';
    tag.textContent = `${langInfo.flag} ${langInfo.label}`;
    meta.appendChild(tag);

    if (role === 'ai' && typeof onPlay === 'function') {
      const pb = document.createElement('button');
      pb.className   = 'play-btn';
      pb.textContent = '▶ play';
      pb.addEventListener('click', () => onPlay(pb));
      meta.appendChild(pb);
    }

    div.appendChild(bubble);
    div.appendChild(meta);
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;

    return div;
  }

  function setPlayBtnState(pb, isPlaying) {
    if (pb) pb.textContent = isPlaying ? '⏸ stop' : '▶ play';
  }

  return {
    renderLangBadges,
    setStatus,
    setTranscript,
    setMicRecording,
    setInputsDisabled,
    getTextInputValue,
    clearTextInput,
    getVoiceSpeed,
    getAutoSpeak,
    addBubble,
    setPlayBtnState,
  };

})();
