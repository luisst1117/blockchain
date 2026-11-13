import { shortAddress } from "../chain/wallet";

function TopBar({ account, roleName, onAbout, onDisconnect }) {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <p className="topbar-mark">
          <span className="mark-diamond" aria-hidden="true" />
          InmoLedger
        </p>
        <div className="topbar-actions">
          {account && (
            <span className="topbar-session">
              {shortAddress(account)}
              {roleName ? ` · ${roleName}` : ""}
            </span>
          )}
          <button type="button" className="ghost ghost-dark" onClick={onAbout}>
            Acerca de
          </button>
          {account && onDisconnect && (
            <button type="button" className="ghost ghost-dark" onClick={onDisconnect}>
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
