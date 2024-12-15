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

    if (data.isAuthenticated) {
      user.value = data.user;
      isAuthenticated.value = true;

      // Salva in sessionStorage
      sessionStorage.setItem("accountName", data.user.username);
      sessionStorage.setItem("favoriteAirport", data.user.favorite_airport);
      sessionStorage.setItem("userAge", data.user.age);
    } else {
      isAuthenticated.value = false;
      user.value = {};
    }
  } catch (error) {
    console.error("Errore nel recupero dati utente:", error.message);
    isAuthenticated.value = false;
    user.value = {};
  }
}

export function useAuth() {
  return { user, isAuthenticated, fetchUserData };
}