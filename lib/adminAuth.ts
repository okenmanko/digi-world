const ADMIN_KEY = "digi_world_admin_access";

export function isAdminLogged() {
  if (typeof window === "undefined") return false;

  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function loginAdmin() {
  localStorage.setItem(ADMIN_KEY, "true");
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}