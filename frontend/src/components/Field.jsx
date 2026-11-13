function Field({ label, hint, required = false, children }) {
  return (
    <div className="field">
      <span className="field-label">
        {label}
        {required ? <em className="req">Obligatorio</em> : null}
      </span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}

export default Field;
