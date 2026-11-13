import { intro } from "../content/about";

function Welcome({ onConnect, connecting, error }) {
  return (
    <section className="welcome">
      <span className="geo geo-ring" aria-hidden="true" />
      <span className="geo geo-diamond" aria-hidden="true" />
      <p className="brand-mark">{intro.kicker}</p>
      <h1>{intro.title}</h1>
      <span className="title-rule" />
      <p className="welcome-lead">{intro.what}</p>
      <p className="welcome-lead muted-lead">{intro.why}</p>

      <div className="role-tiles">
        <article>
          <span className="tile-index">01</span>
          <p className="card-kicker">Propietario</p>
          <p>Inscribe predios a su nombre y transfiere solo los que ya son suyos.</p>
        </article>
        <article>
          <span className="tile-index">02</span>
          <p className="card-kicker">Validador</p>
          <p>Revisa la escritura de un predio registrado y, si cuadra, lo marca como validado.</p>
        </article>
        <article>
          <span className="tile-index">03</span>
          <p className="card-kicker">Administrador</p>
          <p>Da o quita quién puede validar y ve el registro completo.</p>
        </article>
      </div>

      <div className="welcome-actions">
        <button type="button" className="btn-primary" onClick={onConnect} disabled={connecting}>
          {connecting ? "Conectando…" : "Conectar cuenta"}
        </button>
      </div>
      {error && <p className="msg error welcome-error">{error}</p>}
    </section>
  );
}

export default Welcome;
