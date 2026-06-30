import { useState } from "react";

import Header from "./components/Header";
import Recorder from "./components/Recorder";
import Transcript from "./components/Transcript";
import KeywordList from "./components/KeywordList";
import SpeakButton from "./components/SpeakButton";

import useVoiceRecorder from "./hooks/useVoiceRecorder";
import API from "./services/api";

import "./styles/App.css";

function App() {
  const [transcript, setTranscript] = useState("🎤 Click 'Start Listening' and speak...");
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const { startListening, status } = useVoiceRecorder(async (audioBlob) => {
    try {
      setLoading(true);

      setTranscript("⏳ Transcribing your speech...");
      setKeywords([]);

      console.log("Recording Complete ✅");
      console.log(audioBlob);
      console.log(audioBlob.type);

      const formData = new FormData();
      formData.append("audio", audioBlob, "speech.webm");

      const response = await API.post("/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Backend Response:", response.data);

      setTranscript(response.data.transcript);

      setKeywords(response.data.keywords || []);
    } catch (error) {
      console.error("Upload Error:", error);

      if (error.response) {
        console.error("Server Error:", error.response.data);
      }

      setTranscript("❌ Failed to transcribe audio. Please try again.");
      setKeywords([]);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="container">
      <Header />

      <Recorder
        status={status}
        loading={loading}
        startListening={startListening}
      />

      <Transcript transcript={transcript} />

      <KeywordList
        keywords={keywords}
        loading={loading}
      />

      <SpeakButton
        keywords={keywords}
        disabled={loading || keywords.length === 0}
      />
    </div>
  );
}

export default App;