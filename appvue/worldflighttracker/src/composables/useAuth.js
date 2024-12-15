import { ref } from "vue";

const user = ref({});
const isAuthenticated = ref(false);

export async function fetchUserData() {
    try {
        const response = await fetch("http://localhost:3000/session", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();

        console.log("Risposta session:", data); // Log dettagliato della risposta

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
    return { user, isAuthenticated, fetchUserData, isAdmin, resetUserData };
}