<template>
  <div class="container">
    <Navbar :accountName="user.username" :favoriteAirport="user.favorite_airport" />
    <div class="content">
      <!-- Search Box -->
      <div class="search-box">
        <input type="text" v-model="flightCode" placeholder="Inserisci il codice volo" class="flight-input" />
        <button @click="searchFlight" class="search-button">SEARCH</button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <!-- Flight Details -->
      <div v-if="flightDetails" class="flight-details">
        <div class="card">
          <h3>Volo {{ flightDetails.flight.iata }} ({{ flightDetails.airline.name }})</h3>
          <div class="grid">
            <div>
              <strong>Data Volo:</strong> {{ formatDateTime(flightDetails.flight_date) }}
            </div>
            <div>
              <strong>Stato:</strong>
              <span :class="statusClass">{{ flightDetails.flight_status }}</span>
            </div>
            <div>
              <strong>Partenza:</strong> {{ flightDetails.departure.airport }} ({{ flightDetails.departure.iata }})
            </div>
            <div>
              <strong>Terminal/Gate Partenza:</strong> {{ flightDetails.departure.terminal || 'N/A' }} / {{ flightDetails.departure.gate || 'N/A' }}
            </div>
            <div>
              <strong>Orario Partenza:</strong> {{ formatDateTime(flightDetails.departure.scheduled) }}
            </div>
            <div>
              <strong>Arrivo:</strong> {{ flightDetails.arrival.airport }} ({{ flightDetails.arrival.iata }})
            </div>
            <div>
              <strong>Terminal/Gate Arrivo:</strong> {{ flightDetails.arrival.terminal || 'N/A' }} / {{ flightDetails.arrival.gate || 'N/A' }}
            </div>
            <div>
              <strong>Orario Arrivo:</strong> {{ formatDateTime(flightDetails.arrival.scheduled) }}
            </div>
            <div>
              <strong>Ritardo:</strong> {{ flightDetails.arrival.delay || 0 }} minuti
            </div>
            <div v-if="flightDetails.aircraft">
              <strong>Aeromobile:</strong> {{ flightDetails.aircraft.registration }} ({{ flightDetails.aircraft.iata }})
            </div>
            <div v-if="flightDetails.live">
              <strong>Velocità:</strong> {{ flightDetails.live.speed_horizontal }} km/h
            </div>
            <div v-if="flightDetails.live">
              <strong>Altitudine:</strong> {{ flightDetails.live.altitude }} m
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/AppNavbar.vue";
import { fetchUserData, useAuth } from "@/composables/useAuth";
import { format } from "date-fns";

export default {
  name: "SuccessPage",
  components: { Navbar },
  data() {
    return {
      flightCode: "",
      flightDetails: null,
      errorMessage: "",
    };
  },
  async mounted() {
    try {
      await fetchUserData();
      this.loadFlightDetailsFromStorage();
    } catch (error) {
      alert("Errore nel recupero delle informazioni utente.");
      this.$router.push("/");
    }
  },
  computed: {
    user() {
      return useAuth().user.value;
    },
    statusClass() {
      const status = this.flightDetails?.flight_status || "";
      return status === "landed"
        ? "status-landed"
        : status === "active"
        ? "status-active"
        : "status-default";
    },
  },
  methods: {
    async searchFlight() {
      if (!this.flightCode.trim()) {
        this.errorMessage = "Inserisci un codice volo valido.";
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/flights/${this.flightCode}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Errore nella ricerca del volo.");

        this.flightDetails = await response.json();
        this.saveFlightDetailsToStorage();
        this.errorMessage = "";
      } catch (error) {
        this.errorMessage = "Volo non trovato o errore del server.";
        this.flightDetails = null;
        localStorage.removeItem("flightDetails");
      }
    },
    saveFlightDetailsToStorage() {
      // Salva i dettagli del volo in localStorage
      localStorage.setItem("flightDetails", JSON.stringify(this.flightDetails));
    },
    loadFlightDetailsFromStorage() {
      // Carica i dettagli del volo se presenti
      const savedDetails = localStorage.getItem("flightDetails");
      if (savedDetails) {
        this.flightDetails = JSON.parse(savedDetails);
      }
    },
    formatDateTime(dateTime) {
      if (!dateTime) return "N/A";
      try {
        return format(new Date(dateTime), "dd/MM/yyyy HH:mm");
      } catch {
        return "Data non valida";
      }
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #111;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  color: white;
}

.content {
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
}

.search-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  background-color: #222;
  padding: 20px;
  border-radius: 10px;
}

.flight-input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
}

.search-button {
  background-color: #4caf50;
  padding: 10px 15px;
  color: white;
  border-radius: 5px;
}

.flight-details {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

strong {
  color: #4caf50;
}

.status-landed {
  color: #4caf50;
}

.status-active {
  color: #ff9800;
}

.status-default {
  color: #f44336;
}
</style>