function Transcript({ transcript }) {
  return (
    <div className="card">
      <h2>📝 Transcript</h2>

      <div className="transcript-box">
        <p>{transcript}</p>
      </div>
    </div>
  );
}

export default Transcript;