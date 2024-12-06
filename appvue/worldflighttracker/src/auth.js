// auth.js

// Controlla se l'utente è autenticato tramite cookie o sessione
export function isAuthenticated() {
    // Qui puoi usare un cookie o il sessionStorage/session per determinare se l'utente è loggato
    return !!localStorage.getItem('user-token'); // Supponiamo che il token sia salvato in localStorage
  }
  
  // Rendi la funzione isLoggedIn un alias di isAuthenticated
  export const isLoggedIn = isAuthenticated;
  
  // Puoi anche avere altre funzioni di login/logout
  export function login() {
    // Esegui la logica di login
  }
  
  export function logout() {
    // Esegui la logica di logout
    localStorage.removeItem('user-token');
  }