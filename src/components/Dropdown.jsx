import { useEffect, useId, useRef, useState } from 'react';

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  inputId,
  invalid,
  describedBy,
  placeholder = 'Selecciona una opción',
}) {
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const list = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = options.find((option) => option.value === value);

  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }

  function show(index = options.findIndex((option) => option.value === value)) {
    setActive(Math.max(0, index));
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    function handleOutside(event) {
      if (!root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [open]);

  function select(option) {
    onChange(option.value);
    close(true);
  }

  return (
    <div
      className="dropdown"
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          close(true);
        }
      }}
    >
      <button
        id={inputId}
        ref={trigger}
        className={`dropdown-trigger ${open ? 'is-open' : ''}`}
        type="button"
        aria-label={label}
        aria-describedby={[`${id}-selection`, describedBy].filter(Boolean).join(' ')}
        aria-invalid={invalid || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            show(event.key === 'ArrowUp' ? options.length - 1 : undefined);
          }
        }}
      >
        <span id={`${id}-selection`}>{selected?.label || placeholder}</span>
        <span className="dropdown-chevron" aria-hidden="true">
          ⌄
        </span>
      </button>
      {open && (
        <div className="dropdown-panel">
          <div className="dropdown-heading">
            <strong>{label}</strong>
            <button
              type="button"
              className="dropdown-close"
              aria-label="Cerrar opciones"
              onClick={() => close(true)}
            >
              ×
            </button>
          </div>
          <ul
            id={`${id}-list`}
            ref={list}
            role="listbox"
            aria-label={label}
            aria-activedescendant={`${id}-option-${active}`}
            tabIndex={0}
            onKeyDown={(event) => {
              if (
                ['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)
              )
                event.preventDefault();
              if (event.key === 'ArrowDown')
                setActive((index) => (index + 1) % options.length);
              if (event.key === 'ArrowUp')
                setActive((index) => (index - 1 + options.length) % options.length);
              if (event.key === 'Home') setActive(0);
              if (event.key === 'End') setActive(options.length - 1);
              if (event.key === 'Enter' || event.key === ' ') select(options[active]);
            }}
          >
            {options.map((option, index) => (
              <li
                id={`${id}-option-${index}`}
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={active === index ? 'is-highlighted' : ''}
                onPointerMove={() => setActive(index)}
                onClick={() => select(option)}
              >
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                <span className="dropdown-mark" aria-hidden="true">
                  {option.value === value ? '✓' : '›'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
