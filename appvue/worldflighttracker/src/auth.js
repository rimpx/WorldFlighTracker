// auth.js

export function isAuthenticated() {
  // Verifica se l'utente ha un token salvato in localStorage o sessionStorage
  return !!localStorage.getItem('user-token'); // Assicurati che il token sia impostato correttamente al login
}

export const isLoggedIn = isAuthenticated; // Alias per isAuthenticated

export function login(userToken) {
  // Salva il token al login
  localStorage.setItem('user-token', userToken);
}

export function logout() {
  // Rimuovi il token al logout
  localStorage.removeItem('user-token');
}