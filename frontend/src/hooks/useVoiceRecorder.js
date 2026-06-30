import { useRef, useState } from "react";

export default function useVoiceRecorder(onRecordingComplete) {
  const [status, setStatus] = useState("Idle");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  const animationFrameRef = useRef(null);

  const silenceStartRef = useRef(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("Recording Stopped");
      
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      
        silenceStartRef.current = null;
        mediaRecorderRef.current = null;
      
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
      
        stream.getTracks().forEach((track) => track.stop());
      
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      
        setStatus("Idle");
      
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.start();

      setStatus("Listening");

      startVoiceDetection(stream);

    } catch (err) {
      console.error(err);
      setStatus("Permission Denied");
    }
  };

  const startVoiceDetection = (stream) => {
    const audioContext = new AudioContext();

    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 1024;

    analyserRef.current = analyser;

    const source =
      audioContext.createMediaStreamSource(stream);

    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.fftSize);

    const detect = () => {
  if (!mediaRecorderRef.current) {
    return;
  }

      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const value = (dataArray[i] - 128) / 128;
        sum += value * value;
      }

      const rms = Math.sqrt(sum / dataArray.length);

      console.log("RMS:", rms.toFixed(3));

      if (rms > 0.02) {

        silenceStartRef.current = null;

      } else {

        if (!silenceStartRef.current) {
          silenceStartRef.current = Date.now();
        }

        const silenceDuration =
          Date.now() - silenceStartRef.current;

        if (
          silenceDuration > 1200 &&
          mediaRecorderRef.current.state === "recording"
        ) {

          console.log("Silence detected");

          mediaRecorderRef.current.stop();

          return;
        }
      }

      animationFrameRef.current =
        requestAnimationFrame(detect);
    };

    detect();
  };

  return {
    startListening,
    status,
  };
}