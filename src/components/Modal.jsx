import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** Se monta al abrirse y se desmonta al cerrar; no depende del router ni de la tienda. */
export default function Modal({
  children,
  onClose,
  labelledBy,
  describedBy,
  className = '',
  closeLabel = 'Cerrar ventana',
  returnFocusSelector,
  shouldRestoreFocus = () => true,
}) {
  const dialog = useRef(null);
  const focusOptions = useRef({ returnFocusSelector, shouldRestoreFocus });

  useEffect(() => {
    const element = dialog.current;
    const { returnFocusSelector: selector, shouldRestoreFocus: canRestore } =
      focusOptions.current;
    const opener =
      (selector && document.querySelector(selector)) || document.activeElement;
    const scrollPosition = window.scrollY;
    const wasLocked = document.body.classList.contains('locked');

    // El diálogo nativo vuelve inerte el fondo; Tab se controla en el contenedor.
    element.showModal();
    document.body.classList.add('locked');

    return () => {
      element.close();
      if (!wasLocked) document.body.classList.remove('locked');
      // Espera a que termine el cambio de vista antes de recuperar el foco.
      queueMicrotask(() => {
        if (canRestore() && opener?.isConnected && !element.open) {
          opener.focus({ preventScroll: true });
          window.scrollTo({ top: scrollPosition, behavior: 'instant' });
        }
      });
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialog}
      className={`modal ${className}`.trim()}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = [
          ...event.currentTarget.querySelectorAll(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
          ),
        ].filter(
          (element) => element.getClientRects().length > 0 && element.tabIndex >= 0
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <button
        type="button"
        className="close-button"
        aria-label={closeLabel}
        onClick={onClose}
      >
        ×
      </button>
      {children}
    </dialog>,
    document.body
  );
}
