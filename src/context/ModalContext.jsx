import { createContext, useContext, useEffect, useState } from 'react';

const ModalCtx = createContext(null);

export function ModalProvider({ children }) {
  const [content, setContent] = useState(null);

  const open = (node) => setContent(node);
  const close = () => setContent(null);

  useEffect(() => {
    if (!content) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [content]);

  return (
    <ModalCtx.Provider value={{ open, close }}>
      {children}
      {content && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="sheet">
            <div className="grab" />
            {content}
          </div>
        </div>
      )}
    </ModalCtx.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalCtx);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
