import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ConfirmContext = createContext(null);

/**
 * App-styled replacement for window.confirm.
 * const confirm = useConfirm();
 * if (!(await confirm({ title, message, confirmLabel, tone: 'danger' }))) return;
 */
export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);
  const resolverRef = useRef(null);
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const returnFocusRef = useRef(null);

  const confirm = useCallback(options => new Promise(resolve => {
    resolverRef.current?.(false);
    resolverRef.current = resolve;
    returnFocusRef.current = document.activeElement;
    setRequest({ confirmLabel: 'Confirm', cancelLabel: 'Cancel', tone: 'default', ...options });
  }), []);

  const close = useCallback(result => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setRequest(null);
    returnFocusRef.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!request) return undefined;
    // Start on the safe choice so Enter never deletes by accident.
    cancelRef.current?.focus();
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); close(false); }
      if (e.key === 'Tab') {
        const order = [cancelRef.current, confirmRef.current];
        const i = order.indexOf(document.activeElement);
        e.preventDefault();
        order[(i + (e.shiftKey ? -1 : 1) + order.length) % order.length]?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [request, close]);

  const danger = request?.tone === 'danger';
  return <ConfirmContext.Provider value={confirm}>
      {children}
      {request && <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50" onMouseDown={e => { if (e.target === e.currentTarget) close(false); }}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby={request.message ? 'confirm-message' : undefined} className="w-full max-w-[28rem] rounded-2xl bg-surface text-on-surface border border-outline/30 shadow-xl p-6">
            <h2 id="confirm-title" className="text-lg font-bold text-primary">{request.title}</h2>
            {request.message && <p id="confirm-message" className="mt-2 text-sm text-on-surface-variant">{request.message}</p>}
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button ref={cancelRef} type="button" onClick={() => close(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold border border-outline/50 text-primary hover:bg-surface-variant transition-colors">{request.cancelLabel}</button>
              <button ref={confirmRef} type="button" onClick={() => close(true)} className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${danger ? 'bg-error hover:opacity-90' : 'bg-primary hover:opacity-90'}`}>{request.confirmLabel}</button>
            </div>
          </div>
        </div>}
    </ConfirmContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside ConfirmProvider');
  return ctx;
}
