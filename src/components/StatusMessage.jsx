// Small reusable box for "loading" and "error" messages.
function StatusMessage({ loading, error, onRetry, loadingText = "Loading..." }) {
  if (loading) {
    return (
      <div className="status-box" role="status">
        <span className="spinner" aria-hidden="true"></span>
        {loadingText}
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-box status-error" role="alert">
        <p>⚠️ {error}</p>
        {onRetry && (
          <button type="button" className="btn btn-outline" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }

  return null;
}

export default StatusMessage;
