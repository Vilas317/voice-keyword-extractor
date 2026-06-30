import { useState } from "react";

function SpeakButton({ keywords, disabled }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (keywords.length === 0 || isSpeaking) return;

    // Stop any speech that's already playing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      keywords.join(", ")
    );

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      className="speak-btn"
      disabled={disabled || isSpeaking}
      onClick={speak}
    >
      {isSpeaking ? "🔊 Speaking..." : "🔊 Speak Keywords"}
    </button>
  );
}

export default SpeakButton;