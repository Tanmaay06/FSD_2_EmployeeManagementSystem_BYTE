import { createContext, useContext, useState, useCallback } from 'react';
import { IconCheck, IconAlertTriangle, IconInfo } from '../components/Icons';

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

  const iconMap = {
    success: { el: <IconCheck size={11} strokeWidth={3} color="#fff" />, bg: 'var(--success)' },
    error:   { el: <IconAlertTriangle size={11} strokeWidth={2.5} color="#fff" />, bg: 'var(--danger)' },
    info:    { el: <IconInfo size={11} strokeWidth={2.5} color="#fff" />, bg: 'var(--primary)' },
  };
  const iconBubbleStyle = (type) => ({
    background: iconMap[type].bg, borderRadius: '50%',
    width: 22, height: 22, display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  });

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" role="region" aria-label="Notifications">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}${t.exiting ? ' toast--exit' : ''}`} role="alert" aria-live="assertive">
            <span style={iconBubbleStyle(t.type)} aria-hidden="true">{iconMap[t.type].el}</span>
            <span className="toast__body">{t.message}</span>
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
