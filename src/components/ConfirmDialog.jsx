import { useEffect, useRef } from 'react';

/**
 * Accessible confirmation dialog.
 * Props:
 *  - isOpen: boolean
 *  - title: string
 *  - message: string
 *  - onConfirm: () => void
 *  - onCancel: () => void
 *  - confirmLabel: string (default "Confirm")
 *  - cancelLabel: string (default "Cancel")
 *  - danger: boolean – styles confirm button red
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
}) {
  const cancelRef = useRef(null);

  // Trap focus inside dialog when open
  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="dialog">
        <h2 id="dialog-title" className="dialog__title">{title}</h2>
        {message && <p id="dialog-message" className="dialog__message">{message}</p>}
        <div className="dialog__actions">
          <button
            ref={cancelRef}
            className="btn btn--secondary"
            onClick={onCancel}
            id="dialog-cancel-btn"
          >
            {cancelLabel}
          </button>
          <button
            className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
            id="dialog-confirm-btn"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
