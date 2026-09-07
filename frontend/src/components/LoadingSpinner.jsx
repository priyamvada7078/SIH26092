import React from 'react';

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const isSm = size === 'sm';

  if (isSm) {
    return <span className="spinner spinner-sm" aria-label="loading" />;
  }

  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="spinner" />
      <p className="loading-text">{message}</p>
    </div>
  );
}
