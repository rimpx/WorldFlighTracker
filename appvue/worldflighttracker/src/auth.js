export function isAuthenticated() {
  // Verifica se l'utente ha un token salvato in localStorage o sessionStorage
  return !!localStorage.getItem("user-token");
}

export const isLoggedIn = isAuthenticated; // Alias per isAuthenticated

export function login(userToken) {
  // Salva il token al login
  localStorage.setItem("user-token", userToken);
}

export function logout() {
  // Rimuovi il token al logout
  localStorage.removeItem("user-token");
  sessionStorage.clear(); // Pulisci anche sessionStorage
}

export function getToken() {
  // Ottieni il token salvato
  return localStorage.getItem("user-token");
}

export function isAdmin() {
  const isAdminValue = sessionStorage.getItem("isAdmin");
  return isAdminValue === "true" || isAdminValue === "1"; // Verifica entrambi i valori
}