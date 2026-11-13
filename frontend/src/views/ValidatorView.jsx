import ValidateForm from "../components/ValidateForm";
import PropertyList from "../components/PropertyList";
import { STEP } from "../content/guides";

function ValidatorView({ version, selectedId, onSelect, onDone }) {
  return (
    <>
      <div className="grid">
        <ValidateForm selectedId={selectedId} canValidate onDone={onDone} />
      </div>
      <PropertyList
        title="Pendientes de validar"
        emptyText="No hay inmuebles en Registrado. Cuando alguien registre, aparecen aquí."
        kicker={STEP.listPending.kicker}
        lead={STEP.listPending.lead}
        filter="pending"
        version={version}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </>
  );
}

export default ValidatorView;
