import React from 'react';

// Non-blocking stacked toasts. Each toast may carry an optional action
// (used for undo-delete). Auto-dismiss is owned by the App-level queue.
const ToastHost = ({ toasts, onDismiss }) => {
  // Render the live region even when empty so screen readers announce toasts
  // that are added later (content injected into a freshly-mounted region is
  // not reliably announced).
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast${toast.variant === 'error' ? ' toast--error' : ''}`}>
          <span className="toast-body">{toast.message}</span>
          {toast.actionLabel && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                toast.onAction?.();
                onDismiss(toast.id);
              }}
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            type="button"
            className="delete-button"
            aria-label="Dismiss"
            onClick={() => onDismiss(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastHost;
