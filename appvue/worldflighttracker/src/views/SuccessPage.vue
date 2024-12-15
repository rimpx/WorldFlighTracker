<template>
  <div class="container">
    <!-- Navbar riutilizzabile -->
    <Navbar :accountName="user.username" :favoriteAirport="user.favorite_airport" />
    <div class="content">
      <div class="search-box">
        <input
          type="text"
          v-model="flightCode"
          placeholder="Inserisci il codice volo"
          class="flight-input"
        />
        <button @click="searchFlight" class="search-button">SEARCH</button>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/AppNavbar.vue";
import { fetchUserData, useAuth } from "@/composables/useAuth";

export default {
  name: "SuccessPage",
  components: { Navbar },
  data() {
    return {
      flightCode: "", // Input per il codice del volo
    };
  },
  async mounted() {
    await fetchUserData(); // Recupera i dati utente
  },
  computed: {
    user() {
      return useAuth().user.value; // Ottieni i dati utente dal composable
    },
  },
  methods: {
    searchFlight() {
      if (this.flightCode.trim()) {
        alert(`Ricerca del volo: ${this.flightCode}`);
      } else {
        alert("Inserisci un codice volo valido.");
      }
    },
  },
};
</script>

<style scoped>
/* Stili principali */
.container {
  height: 100vh;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
}

/* Contenuto */
.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.search-box {
  background-color: #333;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
  width: 50%;
  max-width: 400px;
  text-align: center;
}

.flight-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.search-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #388E3C;
}
</style>