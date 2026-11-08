import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Icon from '../components/Icon';

const ToastCtx = createContext(null);
const ICONS = { success: 'check', error: 'close', warn: 'alert' };
let uid = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const show = useCallback((message, type = 'success', duration = 2600) => {
    const id = ++uid;
    setToasts((t) => [...t.slice(-2), { id, message, type, visible: false }]);
    requestAnimationFrame(() => {
      setToasts((t) => t.map((x) => (x.id === id ? { ...x, visible: true } : x)));
    });
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const toast = {
    show,
    success: (m, d) => show(m, 'success', d),
    error: (m, d) => show(m, 'error', d),
    warn: (m, d) => show(m, 'warn', d),
  };

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toast-wrap" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type} ${t.visible ? 'show' : ''}`} onClick={() => dismiss(t.id)}>
            <span className="toast-ic">
              <Icon name={ICONS[t.type] || 'check'} className="ic" />
            </span>
            <span className="toast-msg">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
