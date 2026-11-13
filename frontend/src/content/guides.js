export const ROLE_GUIDE = {
  owner: {
    for: "El propietario inscribe predios a su nombre y solo puede pasar a otra persona los que ya son suyos.",
    do: "Ahora: registra uno nuevo o elige una ficha de la lista para transferirla.",
  },
  validator: {
    for: "El validador revisa escrituras. No registra ni transfiere inmuebles.",
    do: "Ahora: abre un pendiente, compara la escritura y, si cuadra, márcalo como validado.",
  },
  admin: {
    for: "El administrador decide quién puede validar y ve el registro completo.",
    do: "Ahora: indica la cuenta, elige dar o quitar permiso y confirma. No sustituye al registro oficial.",
  },
};

export const STEP = {
  register: {
    kicker: "Paso 1 · Inscribir",
    title: "Registrar inmueble",
    hint: "Completa los datos del predio y adjunta la escritura: es obligatoria. El documento se guarda y tú quedas como dueño.",
  },
  transfer: {
    kicker: "Paso 2 · Traspaso",
    title: "Transferir",
    idle: "Elige abajo uno de tus inmuebles. Vas a pasar el título a otra cuenta y dejarás de ser el dueño.",
    ready: (id) =>
      `Vas a transferir el inmueble #${id}. Escribe la cuenta que lo recibe y confirma. Solo funciona si ese título es tuyo.`,
  },
  validate: {
    kicker: "Paso 1 · Revisión",
    title: "Validar ficha",
    allowed: "Elige un pendiente, abre Ver ficha y mira la escritura. Si coincide, confirma: pasa de Registrado a Validado.",
    denied: "Esta cuenta no tiene permiso de validador. Pide al administrador que te lo asigne.",
  },
  permissions: {
    kicker: "Paso 1 · Permisos",
    title: "Quién puede validar",
    hint: "Indica la cuenta y elige si le das o le quitas el rol. Solo el administrador puede hacerlo.",
  },
  clear: {
    kicker: "Paso 3 · Limpieza",
    title: "Vaciar registro",
    hint: "Retira los títulos activos de esta aplicación. Los documentos guardados no se eliminan de internet. Solo el administrador.",
  },
  listMine: {
    kicker: "Paso 3 · Consulta",
    lead: "Tus inmuebles. Un clic carga el número para transferir. Ver ficha muestra los datos, la escritura y el historial.",
  },
  listPending: {
    kicker: "Paso 2 · Cola",
    lead: "Solo fichas en estado Registrado. Un clic carga el número para validar. Abre Ver ficha antes de confirmar.",
  },
  listAll: {
    kicker: "Paso 2 · Consulta",
    lead: "Todas las fichas. Aquí se consulta; los permisos se cambian arriba.",
  },
  ficha: "Resumen del predio: dirección, tipo, área y dueño, tal como se guardó al registrar.",
  chain: "Quién registró, quién validó y a quién pasó el título. Cada recuadro es un movimiento de este inmueble.",
  escritura: "Documento que se adjuntó al registrar. Revísalo antes de validar o de transferir.",
};
