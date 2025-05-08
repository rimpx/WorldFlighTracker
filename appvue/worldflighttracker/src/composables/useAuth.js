import { ref } from "vue";

const user = ref({});
const isAuthenticated = ref(false);

/**
 * Determina dinamicamente l'URL base dell'API
 * @returns {string} URL base dell'API
 */
function getApiBaseUrl() {
  const isHttps = window.location.protocol === 'https:';
  
  if (window.location.host.includes('.app.github.dev') || isHttps) {
    const hostParts = window.location.host.split('-');
    if (hostParts.length > 1) {
      const portIndex = hostParts.length - 1;
      hostParts[portIndex] = '3000';
      return `${window.location.protocol}//${hostParts.join('-')}.app.github.dev`;
    } else {
      return `${window.location.protocol}//${window.location.hostname}:3000`;
    }
  } else {
    return 'http://localhost:3000';
  }
}

export async function fetchUserData() {
    try {
        // Usa l'URL base dinamico
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/session`, {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();

        console.log("Risposta session:", data, "da URL:", `${apiBaseUrl}/session`);

        if (data.isAuthenticated) {
            user.value = data.user;
            isAuthenticated.value = true;

            // Salva in sessionStorage
            sessionStorage.setItem("accountName", data.user.username);
            sessionStorage.setItem("favoriteAirport", data.user.favorite_airport);
            sessionStorage.setItem("userAge", data.user.age);
            sessionStorage.setItem("isAdmin", String(data.user.is_admin)); // Salva come stringa
        } else {
            console.warn("Utente non autenticato");
            isAuthenticated.value = false;
            user.value = {};
        }
    } catch (error) {
        console.error("Errore nel recupero dati utente:", error.message);
        isAuthenticated.value = false;
        user.value = {};
    }
}

/**
 * Verifica se l'utente autenticato è un admin.
 * @returns {boolean} True se l'utente è admin.
 */
export function isAdmin() {
    return sessionStorage.getItem("isAdmin") === "true"; // Controlla il flag isAdmin
}

/**
 * Resetta i dati dell'utente autenticato.
 */
export function resetUserData() {
    user.value = {};
    isAuthenticated.value = false;
    sessionStorage.clear(); // Pulisci i dati della sessione
}

/**
 * Hook per accedere ai dati di autenticazione.
 */
export function useAuth() {
    return { user, isAuthenticated, fetchUserData, isAdmin, resetUserData, getApiBaseUrl };
}