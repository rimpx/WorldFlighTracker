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

      <!-- Current Flight Details -->
      <div v-if="flightDetails" class="flight-details">
        <div class="card current-flight">
          <div class="card-header">
            <h3>Volo {{ flightDetails.flight.iata }} ({{ flightDetails.airline.name }})</h3>
            <button 
              @click="toggleFavorite(flightDetails)" 
              class="favorite-button"
              :class="{ 'is-favorite': isFlightFavorite(flightDetails) }"
            >
              {{ isFlightFavorite(flightDetails) ? '★' : '☆' }}
            </button>
          </div>
          <div class="grid">
            <div>
              <strong>Data Volo:</strong> {{ formatDateTime(flightDetails.flight_date) }}
            </div>
            <div>
              <strong>Stato:</strong>
              <span :class="statusClass(flightDetails)">{{ flightDetails.flight_status }}</span>
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

      <!-- Favorite Flights Section -->
      <div v-if="favoriteFlights.length > 0" class="favorites-section">
        <h2 class="section-title">I Tuoi Voli Preferiti</h2>
        <div class="favorites-grid">
          <div class="favorite-card" v-for="flight in favoriteFlights" :key="getFavoriteKey(flight)">
            <div class="favorite-card-header">
              <h3>{{ flight.flight.iata }} ({{ flight.airline.name }})</h3>
              <button @click="toggleFavorite(flight)" class="remove-favorite">
                ✖
              </button>
            </div>
            <div class="favorite-details">
              <div class="favorite-route">
                <span class="airport-code">{{ flight.departure.iata }}</span>
                <span class="route-arrow">→</span>
                <span class="airport-code">{{ flight.arrival.iata }}</span>
              </div>
              <div class="favorite-status">
                <span :class="statusClass(flight)">{{ flight.flight_status }}</span>
                <span class="flight-date">{{ formatDateTime(flight.flight_date).split(' ')[0] }}</span>
              </div>
              <div class="favorite-times">
                <span>{{ formatTime(flight.departure.scheduled) }}</span>
                <span class="time-separator">-</span>
                <span>{{ formatTime(flight.arrival.scheduled) }}</span>
              </div>
            </div>
            <button @click="loadFavoriteDetails(flight)" class="view-details-button">
              🔍 Mostra dettagli
            </button>
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
import io from "socket.io-client";

export default {
  name: "SuccessPage",
  components: { Navbar },
  data() {
    return {
      flightCode: "",
      flightDetails: null,
      errorMessage: "",
      socket: null,
      favoriteFlights: [], // Array per i voli preferiti
    };
  },
  async mounted() {
    try {
      await fetchUserData();
      this.loadFlightDetailsFromStorage();
      this.loadFavoritesFromStorage(); // Carica i preferiti

      // Inizializza la connessione WebSocket con opzioni di riconnessione
      this.socket = io("http://localhost:3000", {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      this.socket.on('connect', () => {
        console.log('Connesso al server WebSocket');
      });
      
      this.socket.on("disconnect", () => {
        console.log("Disconnesso dal server WebSocket");
      });
    } catch (error) {
      console.error("Errore nel recupero delle informazioni utente:", error);
      alert("Errore nel recupero delle informazioni utente.");
      this.$router.push("/");
    }
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  computed: {
    user() {
      return useAuth().user.value;
    },
  },
  methods: {
    async searchFlight() {
      if (!this.flightCode.trim()) {
        this.errorMessage = "Inserisci un codice volo valido.";
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:3000/api/flights/${this.flightCode}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

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
    
    // Salva/carica il volo corrente
    saveFlightDetailsToStorage() {
      localStorage.setItem("flightDetails", JSON.stringify(this.flightDetails));
    },
    loadFlightDetailsFromStorage() {
      const savedDetails = localStorage.getItem("flightDetails");
      if (savedDetails) {
        this.flightDetails = JSON.parse(savedDetails);
      }
    },
    
    // Salva/carica i preferiti
    saveFavoritesToStorage() {
      localStorage.setItem("favoriteFlights", JSON.stringify(this.favoriteFlights));
    },
    loadFavoritesFromStorage() {
      const savedFavorites = localStorage.getItem("favoriteFlights");
      if (savedFavorites) {
        this.favoriteFlights = JSON.parse(savedFavorites);
      }
    },
    
    // Gestione preferiti
    toggleFavorite(flight) {
      if (this.isFlightFavorite(flight)) {
        // Rimuovi dai preferiti
        const index = this.favoriteFlights.findIndex(f => 
          f.flight.iata === flight.flight.iata && 
          f.flight_date === flight.flight_date
        );
        if (index !== -1) {
          this.favoriteFlights.splice(index, 1);
          this.saveFavoritesToStorage();
        }
      } else {
        // Aggiungi ai preferiti
        this.favoriteFlights.push(JSON.parse(JSON.stringify(flight)));
        this.saveFavoritesToStorage();
      }
    },
    isFlightFavorite(flight) {
      return this.favoriteFlights.some(f => 
        f.flight.iata === flight.flight.iata && 
        f.flight_date === flight.flight_date
      );
    },
    getFavoriteKey(flight) {
      return `${flight.flight.iata}-${flight.flight_date}`;
    },
    loadFavoriteDetails(flight) {
      this.flightDetails = JSON.parse(JSON.stringify(flight));
      this.saveFlightDetailsToStorage();
      // Scroll to top to see the flight details
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    // Formattazione date e stati
    formatDateTime(dateTime) {
      if (!dateTime) return "N/A";
      try {
        return format(new Date(dateTime), "dd/MM/yyyy HH:mm");
      } catch {
        return "Data non valida";
      }
    },
    formatTime(dateTime) {
      if (!dateTime) return "N/A";
      try {
        return format(new Date(dateTime), "HH:mm");
      } catch {
        return "N/A";
      }
    },
    statusClass(flight) {
      const status = flight?.flight_status || "";
      return status === "landed"
        ? "status-landed"
        : status === "active"
        ? "status-active"
        : "status-default";
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
  font-family: Arial, sans-serif;
  color: white;
  padding: 0;
}

.content {
  width: 100%;
  max-width: 1400px;
  margin: 80px auto 0;
  padding: 0 20px 20px;
  flex: 1;
}

/* Search Box */
.search-box {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  background-color: #222;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.flight-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #444;
  border-radius: 6px;
  background-color: #333;
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.flight-input:focus {
  border-color: #4CAF50;
  outline: none;
}

.search-button {
  background-color: #4CAF50;
  padding: 12px 25px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #45a049;
}

/* Flight Details */
.flight-details {
  width: 100%;
  margin-top: 20px;
}

.card {
  background-color: #333;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #4CAF50;
  padding-bottom: 10px;
}

.card-header h3 {
  margin-bottom: 0;
  border-bottom: none;
}

strong {
  color: #4CAF50;
  display: block;
  margin-bottom: 5px;
}

/* Favorite Button */
.favorite-button {
  background-color: transparent;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  margin-left: 15px;
}

.favorite-button:hover {
  color: #ffc107;
  transform: scale(1.1);
}

.favorite-button.is-favorite {
  color: #ffc107;
}

/* Status Classes */
.status-landed {
  color: #4CAF50;
}

.status-active {
  color: #FF9800;
}

.status-default {
  color: #F44336;
}

/* Error Message */
.error-message {
  color: #FF4444;
  padding: 15px;
  background-color: #222;
  border-radius: 6px;
  margin: 20px 0;
  text-align: center;
}

/* Favorites Section */
.section-title {
  font-size: 1.8rem;
  color: #4CAF50;
  margin: 40px 0 20px;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.favorite-card {
  background-color: #252525;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.favorite-card:hover {
  transform: translateY(-5px);
}

.favorite-card-header {
  background-color: #333;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-card-header h3 {
  font-size: 1.2rem;
  margin: 0;
  padding: 0;
}

.remove-favorite {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 1rem;
  padding: 5px;
}

.remove-favorite:hover {
  color: #ff4444;
}

.favorite-details {
  padding: 15px;
}

.favorite-route {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.airport-code {
  font-size: 1.2rem;
  font-weight: bold;
}

.route-arrow {
  color: #4CAF50;
}

.favorite-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.flight-date {
  opacity: 0.7;
}

.favorite-times {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
}

.time-separator {
  color: #4CAF50;
}

.view-details-button {
  width: 100%;
  padding: 12px;
  border: none;
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-details-button:hover {
  background-color: #34495e;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content {
    max-width: 95%;
    margin-top: 70px;
  }

  .grid {
    gap: 15px;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .content {
    margin-top: 60px;
    padding: 0 15px 15px;
  }

  .search-box {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  h3 {
    font-size: 1.3rem;
  }
  
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .content {
    margin-top: 50px;
    padding: 0 10px 10px;
  }

  .card {
    padding: 15px;
  }

  h3 {
    font-size: 1.1rem;
  }

  .flight-input {
    padding: 10px;
    font-size: 0.9rem;
  }

  .search-button {
    padding: 10px;
    font-size: 0.9rem;
  }
  
  .favorite-card-header h3 {
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  .content {
    margin-top: 40px;
  }

  .grid {
    gap: 10px;
  }

  h3 {
    font-size: 1rem;
  }
}
</style>