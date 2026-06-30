function KeywordList({ keywords, loading }) {
  return (
    <div className="card">
      <h2>🏷 Keywords</h2>

      <div className="chips">
        {loading ? (
          <p className="loading-text">
            ⏳ Extracting keywords...
          </p>
        ) : keywords.length === 0 ? (
          <div className="empty-state">
            <p>🎤 Speak something...</p>
            <small>Your keywords will appear here.</small>
          </div>
        ) : (
          keywords.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="chip"
            >
              {word}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default KeywordList;