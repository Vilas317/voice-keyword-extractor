function Recorder({
  status,
  loading,
  startListening,
}) {
  const isListening = status === "Listening";
  const disabled = isListening || loading;

  return (
    <div className="card">
      <button
        className="record-btn"
        disabled={disabled}
        onClick={startListening}
      >
        {loading
          ? "⏳ Processing..."
          : isListening
          ? "🎙 Listening..."
          : "🎤 Start Listening"}
      </button>

      <h3 className="status">
        {loading
          ? "⏳ Status: Processing..."
          : isListening
          ? "🟢 Status: Listening"
          : "⚪ Status: Idle"}
      </h3>

      <p className="status-message">
        {loading
          ? "Extracting transcript and keywords..."
          : isListening
          ? "Speak normally. Recording will stop automatically after a short silence."
          : "Click the button and start speaking."}
      </p>
    </div>
  );
}

export default Recorder;