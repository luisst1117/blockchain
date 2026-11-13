import RegisterForm from "../components/RegisterForm";
import TransferForm from "../components/TransferForm";
import PropertyList from "../components/PropertyList";
import { STEP } from "../content/guides";

function OwnerView({ account, version, selectedId, onSelect, onDone }) {
  return (
    <>
      <div className="grid">
        <RegisterForm onDone={onDone} />
        <TransferForm selectedId={selectedId} onDone={onDone} />
      </div>
      <PropertyList
        title="Mis inmuebles"
        emptyText="Aún no tienes inmuebles. Empieza por el Paso 1: registrar con escritura."
        kicker={STEP.listMine.kicker}
        lead={STEP.listMine.lead}
        filter="mine"
        account={account}
        version={version}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </>
  );
}

export default OwnerView;
