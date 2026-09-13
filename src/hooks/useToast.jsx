import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);
let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const tid = ++id;
    setToasts(prev => [...prev, { id: tid, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === tid ? { ...t, exiting: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== tid)), 280);
    }, duration);
  }, []);

  const removeToast = useCallback((tid) => {
    setToasts(prev => prev.map(t => t.id === tid ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== tid)), 280);
  }, []);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" role="region" aria-label="Notifications">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}${t.exiting ? ' toast--exit' : ''}`} role="alert">
            <span className="toast__icon">{icons[t.type]}</span>
            <span>{t.message}</span>
            <button className="toast__close" onClick={() => removeToast(t.id)} aria-label="Dismiss notification">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx.addToast;
}
