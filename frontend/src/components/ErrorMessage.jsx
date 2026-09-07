import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred.',
  onRetry = null,
}) {
  return (
    <div className="alert alert-danger" role="alert">
      <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div className="alert-content">
        <div className="alert-title">{title}</div>
        <div>{message}</div>
        {onRetry && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRetry}
            style={{ marginTop: '0.75rem' }}
          >
            <RefreshCw size={14} /> Try Again
          </button>
        )}
      </div>
    </div>
  );
}
