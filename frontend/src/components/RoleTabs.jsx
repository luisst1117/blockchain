import { ROLE_GUIDE } from "../content/guides";
import { ROLE_LABEL } from "../roles";

function RoleTabs({ available, current, onChange }) {
  if (!available.length) return null;
  const guide = ROLE_GUIDE[current];

  return (
    <div className="role-panel">
      <nav className="role-tabs" aria-label="Roles">
        {available.map((role) => (
          <button
            key={role}
            type="button"
            className={role === current ? "role-tab active" : "role-tab"}
            onClick={() => onChange(role)}
          >
            {ROLE_LABEL[role]}
          </button>
        ))}
      </nav>
      {guide && (
        <div className="role-blurb">
          <p>
            <strong>{ROLE_LABEL[current]}.</strong> {guide.for} {guide.do}
          </p>
        </div>
      )}
    </div>
  );
}

export default RoleTabs;
