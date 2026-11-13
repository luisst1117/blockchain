import ValidatorForm from "../components/ValidatorForm";
import ClearRegistry from "../components/ClearRegistry";
import PropertyList from "../components/PropertyList";
import { STEP } from "../content/guides";

function AdminView({ version, onDone }) {
  return (
    <>
      <div className="grid">
        <ValidatorForm onDone={onDone} />
        <ClearRegistry onDone={onDone} />
      </div>
      <PropertyList
        title="Registro completo"
        emptyText="Todavía no hay inmuebles en este registro."
        kicker={STEP.listAll.kicker}
        lead={STEP.listAll.lead}
        filter="all"
        version={version}
      />
    </>
  );
}

export default AdminView;
