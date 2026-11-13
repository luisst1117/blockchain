export const ROLES = {
  OWNER: "owner",
  VALIDATOR: "validator",
  ADMIN: "admin",
};

export const ROLE_LABEL = {
  owner: "Propietario",
  validator: "Validador",
  admin: "Administrador",
};

export function rolesForWallet({ isAdmin, isValidator, account }) {
  const list = [];
  if (account) list.push(ROLES.OWNER);
  if (isValidator) list.push(ROLES.VALIDATOR);
  if (isAdmin) list.push(ROLES.ADMIN);
  return list;
}

export function defaultRole(available) {
  if (available.includes(ROLES.ADMIN)) return ROLES.ADMIN;
  if (available.includes(ROLES.VALIDATOR)) return ROLES.VALIDATOR;
  if (available.includes(ROLES.OWNER)) return ROLES.OWNER;
  return null;
}
