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
        <!-- Contenuto invariato -->
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
            <!-- Contenuto invariato -->
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Caricamento...</p>
      </div>

      <!-- Favorite Flights Section -->
      <div v-if="favoriteFlights.length > 0" class="favorites-section">
        <!-- Contenuto invariato -->
      </div>

      <!-- No favorites message -->
      <div v-else-if="!isLoading" class="no-favorites">
        <p>Non hai ancora salvato voli preferiti. Cerca un volo e aggiungilo ai preferiti.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/AppNavbar.vue";
import { fetchUserData, useAuth } from "@/composables/useAuth";
import { format } from "date-fns";
// Rimosso l'import di socket.io-client

export default {
  name: "SuccessPage",
  components: { Navbar },
  data() {
    return {
      flightCode: "",
      flightDetails: null,
      errorMessage: "",
      favoriteFlights: [],
      isLoading: false,
      apiBaseUrl: ""
      // Rimossa la proprietà socket
      // Rimossa la proprietà socketConnected
    };
  },
  async mounted() {
    try {
      // Configura l'URL dell'API base
      this.configureApiBaseUrl();
      
      // Carica dati utente e preferiti
      await fetchUserData();
      this.loadFlightDetailsFromStorage();
      await this.fetchFavorites();
      
      // Rimossa l'inizializzazione della connessione WebSocket
    } catch (error) {
      console.error("Errore nel recupero delle informazioni utente:", error);
      alert("Errore nel recupero delle informazioni utente.");
      this.$router.push("/");
    }
  },
  // Rimosso il metodo beforeUnmount() per la disconnessione WebSocket
  computed: {
    user() {
      return useAuth().user.value;
    },
  },
  methods: {
    configureApiBaseUrl() {
      // Strategia dinamica per determinare l'URL di base dell'API
      const isHttps = window.location.protocol === 'https:';
      
      if (window.location.host.includes('.app.github.dev') || isHttps) {
        const hostParts = window.location.host.split('-');
        if (hostParts.length > 1) {
          const portIndex = hostParts.length - 1;
          hostParts[portIndex] = '3000';
          this.apiBaseUrl = `${window.location.protocol}//${hostParts.join('-')}`;
        } else {
          this.apiBaseUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
        }
      } else {
        this.apiBaseUrl = 'http://localhost:3000';
      }
      
      console.log(`API Base URL configurato: ${this.apiBaseUrl}`);
    },
    
    // Rimosso il metodo initializeSocketConnection() 
    
    async searchFlight() {
      // Metodo invariato ma usa apiBaseUrl
      if (!this.flightCode.trim()) {
        this.errorMessage = "Inserisci un codice volo valido.";
        return;
      }
      
      this.isLoading = true;
      
      try {
        const response = await fetch(
          `${this.apiBaseUrl}/api/flights/${this.flightCode}`,
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
      } finally {
        this.isLoading = false;
      }
    },
    
    // Altri metodi invariati ma che usano apiBaseUrl
    // ...
    
    saveFlightDetailsToStorage() {
      localStorage.setItem("flightDetails", JSON.stringify(this.flightDetails));
    },
    
    loadFlightDetailsFromStorage() {
      const savedDetails = localStorage.getItem("flightDetails");
      if (savedDetails) {
        this.flightDetails = JSON.parse(savedDetails);
      }
    },
    
    async fetchFavorites() {
      this.isLoading = true;
      
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/favorites`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Errore nel caricamento dei preferiti');
        }
        
        this.favoriteFlights = await response.json();
      } catch (error) {
        console.error('Errore nel caricamento dei voli preferiti:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async toggleFavorite(flight) {
      if (this.isFlightFavorite(flight)) {
        await this.removeFavorite(flight);
      } else {
        await this.addFavorite(flight);
      }
    },
    
    async addFavorite(flight) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(flight)
        });
        
        if (!response.ok) {
          throw new Error('Errore nell\'aggiunta del preferito');
        }
        
        await this.fetchFavorites();
      } catch (error) {
        console.error('Errore nell\'aggiunta del volo ai preferiti:', error);
      }
    },
    
    async removeFavorite(flight) {
      try {
        const flightKey = `${flight.flight.iata}-${flight.flight_date}`;
        const response = await fetch(`${this.apiBaseUrl}/api/favorites/${encodeURIComponent(flightKey)}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Errore nella rimozione del preferito');
        }
        
        await this.fetchFavorites();
      } catch (error) {
        console.error('Errore nella rimozione del volo dai preferiti:', error);
      }
    },
    
    // Gli altri metodi utili restano invariati
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    // Metodi di formattazione invariati
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

/* Socket Status Indicator */
.socket-status {
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.socket-status.connected {
  background-color: #4CAF50;
  color: white;
}

.socket-status.disconnected {
  background-color: #f44336;
  color: white;
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

/* Loading Spinner */
.loading-spinner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: #4CAF50;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-favorites {
  text-align: center;
  padding: 30px;
  background-color: #222;
  border-radius: 10px;
  margin-top: 30px;
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