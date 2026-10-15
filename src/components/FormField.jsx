export default function FormField({ id, label, help, error, children }) {
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        <span aria-hidden="true"> *</span>
      </label>
      {help && (
        <p className="field-help" id={`${id}-help`}>
          {help}
        </p>
      )}
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
