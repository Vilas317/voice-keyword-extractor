function Header() {
  return (
    <header className="header">
      <h1>🎤 Voice Keyword Extractor</h1>

      <p className="subtitle">
        Record → Transcribe → Extract → Speak
      </p>

      <div className="tech-badge">
        <span>React</span>
        <span>VAD</span>
        <span>Groq Whisper</span>
        <span>Llama 3.3</span>
      </div>
    </header>
  );
}

export default Header;