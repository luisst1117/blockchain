import { ROLE_GUIDE } from "../content/guides";
import { ROLE_LABEL } from "../roles";

function Header({ roleKey }) {
  const guide = ROLE_GUIDE[roleKey];
  const name = ROLE_LABEL[roleKey];

  return (
    <header className="header">
      <p className="brand-mark">Popayán · red de pruebas</p>
      <h1>InmoLedger</h1>
      <span className="title-rule" />
      <p className="lede">
        {guide
          ? `${name}: ${guide.for}`
          : "Registra el predio, guarda la escritura y deja constancia de quién es el dueño."}
      </p>
    </header>
  );
}

export default Header;
