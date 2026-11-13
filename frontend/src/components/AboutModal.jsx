import { useEffect } from "react";
import { about } from "../content/about";

function AboutModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ficha-overlay" onClick={onClose} role="presentation">
      <div
        className="ficha-sheet about-sheet"
        role="dialog"
        aria-labelledby="about-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="about-title">{about.title}</h2>

        <h3>{about.purposeTitle}</h3>
        {about.purpose.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
        <p>{about.rolesLead}</p>
        <ul className="about-roles">
          {about.roles.map((role) => (
            <li key={role.name}>
              <strong>{role.name}:</strong> {role.text}
            </li>
          ))}
        </ul>
        <p>{about.closing}</p>

        <h3>{about.authorTitle}</h3>
        <div className="about-author">
          <figure className="about-photo">
            <img src={about.authorPhoto} alt={about.authorName} />
          </figure>
          <div>
            <p>
              <strong>{about.authorName}</strong>
            </p>
            <p>{about.author}</p>
          </div>
        </div>

        <div className="ficha-actions">
          <span />
          <button type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
