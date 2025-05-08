<template>
  <div class="container">
    <Navbar :accountName="user.username" :favoriteAirport="user.favorite_airport" />
    <div class="content">
      <!-- Search Box -->
      <div class="search-box">
        <div class="search-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h2>Cerca Voli</h2>
        </div>
        <div class="search-form">
          <input type="text" v-model="flightCode" placeholder="Inserisci il codice volo (es. AZ1234)" class="flight-input" />
          <button @click="searchFlight" class="search-button">
            <span class="btn-icon">🔍</span>
            <span class="btn-text">CERCA</span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {{ errorMessage }}
      </div>

      <!-- Current Flight Details -->
      <div v-if="flightDetails" class="flight-details">
        <div class="card current-flight">
          <div class="card-header">
            <div class="flight-title">
              <div class="flight-airline-logo">
                <span class="logo-placeholder">{{ flightDetails.airline.name.charAt(0) }}</span>
              </div>
              <h3>Volo {{ flightDetails.flight.iata }} <span class="airline-name">({{ flightDetails.airline.name }})</span></h3>
            </div>
            <button 
              @click="toggleFavorite(flightDetails)" 
              class="favorite-button"
              :class="{ 'is-favorite': isFlightFavorite(flightDetails) }"
            >
              {{ isFlightFavorite(flightDetails) ? '★' : '☆' }}
            </button>
          </div>
          
          <div class="flight-route">
            <div class="route-point departure">
              <div class="airport-code">{{ flightDetails.departure.iata }}</div>
              <div class="airport-name">{{ flightDetails.departure.airport }}</div>
            </div>
            <div class="route-line">
              <svg viewBox="0 0 100 20" class="route-arrow">
                <path d="M0 10 H 95 M 85 2 L 95 10 L 85 18" fill="none" stroke="currentColor" stroke-width="2" />
              </svg>
              <div class="flight-status-badge" :class="statusClass(flightDetails)">
                {{ flightDetails.flight_status === 'landed' ? 'Atterrato' : 
                   flightDetails.flight_status === 'active' ? 'In Volo' : 'Programmato' }}
              </div>
            </div>
            <div class="route-point arrival">
              <div class="airport-code">{{ flightDetails.arrival.iata }}</div>
              <div class="airport-name">{{ flightDetails.arrival.airport }}</div>
            </div>
          </div>
          
          <div class="grid">
            <!-- Dettagli di partenza -->
            <div class="detail-card departure-details">
              <strong>
                <svg xmlns="http://www.w3.org/2000/svg" class="detail-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M5 21h14M16 10l-4 4m0 0l-4-4m4 4V3" stroke="currentColor" stroke-width="2" />
                </svg>
                Partenza
              </strong>
              <p class="time-large">{{ formatTime(flightDetails.departure.scheduled) }}</p>
              <p class="date">{{ formatDateTime(flightDetails.departure.scheduled).split(' ')[0] }}</p>
              <div class="detail-row">
                <span class="detail-label">Terminal:</span>
                <span class="detail-value">{{ flightDetails.departure.terminal || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Gate:</span>
                <span class="detail-value">{{ flightDetails.departure.gate || 'N/A' }}</span>
              </div>
            </div>

            <!-- Dettagli di arrivo -->
            <div class="detail-card arrival-details">
              <strong>
                <svg xmlns="http://www.w3.org/2000/svg" class="detail-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M5 21h14M16 14l-4-4m0 0l-4 4m4-4v12" stroke="currentColor" stroke-width="2" />
                </svg>
                Arrivo
              </strong>
              <p class="time-large">{{ formatTime(flightDetails.arrival.scheduled) }}</p>
              <p class="date">{{ formatDateTime(flightDetails.arrival.scheduled).split(' ')[0] }}</p>
              <div class="detail-row">
                <span class="detail-label">Terminal:</span>
                <span class="detail-value">{{ flightDetails.arrival.terminal || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Gate:</span>
                <span class="detail-value">{{ flightDetails.arrival.gate || 'N/A' }}</span>
              </div>
            </div>
            
            <!-- Info aeromobile -->
            <div class="detail-card aircraft-info">
              <strong>
                <svg xmlns="http://www.w3.org/2000/svg" class="detail-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a1 1 0 01-1.11 1 16.92 16.92 0 01-15.78-15.78A1 1 0 016.22 4h3a1 1 0 01.93.66l1.13 3.4a1 1 0 01-.27 1.05l-1.71 1.71c1.25 2.35 3.19 4.29 5.54 5.54l1.71-1.71a1 1 0 011.05-.27l3.4 1.13a1 1 0 01.66.93z" stroke="currentColor" stroke-width="2" />
                </svg>
                Aeromobile
              </strong>
              <div class="detail-row">
                <span class="detail-label">Modello:</span>
                <span class="detail-value">{{ flightDetails.aircraft?.icao || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Registrazione:</span>
                <span class="detail-value">{{ flightDetails.aircraft?.registration || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Data volo:</span>
                <span class="detail-value">{{ formatDateTime(flightDetails.flight_date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Ricerca in corso...</p>
      </div>

      <!-- Favorite Flights Section -->
      <div v-if="favoriteFlights.length > 0" class="favorites-section">
        <h2 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 16.36 2 13.25 2 9.5 2 6.42 4.42 4 7.5 4c1.74 0 3.41.81 4.5 2.09C13.09 4.81 14.76 4 16.5 4 19.58 4 22 6.42 22 9.5c0 3.75-3.4 6.86-8.55 10.54L12 21.35z" fill="currentColor" />
          </svg>
          I Tuoi Voli Preferiti
        </h2>
        <div class="favorites-grid">
          <div class="favorite-card" v-for="favorite in favoriteFlights" :key="getFavoriteKey(favorite)">
            <div class="favorite-card-header">
              <h3>{{ favorite.flight.iata }}</h3>
              <button @click="toggleFavorite(favorite)" class="remove-favorite">
                ×
              </button>
            </div>
            <div class="favorite-details">
              <div class="favorite-route">
                <span class="airport-code">{{ favorite.departure.iata }}</span>
                <span class="route-arrow">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" />
                  </svg>
                </span>
                <span class="airport-code">{{ favorite.arrival.iata }}</span>
              </div>
              <div class="favorite-status">
                <span class="status-pill" :class="statusClass(favorite)">
                  {{ favorite.flight_status === 'landed' ? 'Atterrato' : 
                     favorite.flight_status === 'active' ? 'In Volo' : 'Programmato' }}
                </span>
                <span class="flight-date">{{ formatDateTime(favorite.flight_date).split(' ')[0] }}</span>
              </div>
              <div class="favorite-times">
                <span class="time-badge">{{ formatTime(favorite.departure.scheduled) }}</span>
                <span class="time-separator">-</span>
                <span class="time-badge">{{ formatTime(favorite.arrival.scheduled) }}</span>
              </div>
            </div>
            <button @click="loadFavoriteDetails(favorite)" class="view-details-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="details-icon" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
              </svg>
              Visualizza Dettagli
            </button>
          </div>
        </div>
      </div>

      <!-- No favorites message -->
      <div v-else-if="!isLoading" class="no-favorites">
        <div class="empty-state-icon">☆</div>
        <p>Non hai ancora salvato voli preferiti.</p>
        <p class="empty-instructions">Cerca un volo utilizzando il codice (es. AZ1234) e aggiungilo ai preferiti.</p>
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
          this.apiBaseUrl = `${window.location.protocol}//${hostParts.join('-')}.app.github.dev`;
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
/* Animazioni */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}

/* Contenitore principale */
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #121212, #1e2023);
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: white;
  padding: 0;
}

.content {
  width: 100%;
  max-width: 1400px;
  margin: 90px auto 30px;
  padding: 0 30px 30px;
  flex: 1;
  animation: fadeIn 0.5s ease-out;
}

/* Box di ricerca */
.search-box {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.search-box:hover {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.search-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.search-icon {
  width: 24px;
  height: 24px;
  stroke: #3498db;
}

.search-title h2 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
  font-weight: 500;
}

.search-form {
  display: flex;
  gap: 15px;
}

.flight-input {
  flex: 1;
  padding: 14px 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.flight-input:focus {
  border-color: #3498db;
  background-color: rgba(255, 255, 255, 0.15);
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.flight-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
  background: linear-gradient(135deg, #2980b9, #2173a6);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Messaggio di errore */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: rgba(231, 76, 60, 0.1);
  border-left: 4px solid #e74c3c;
  color: #e74c3c;
  border-radius: 6px;
  margin: 20px 0;
  font-weight: 500;
  animation: fadeIn 0.3s ease-out;
}

.error-icon {
  width: 20px;
  height: 20px;
  stroke: #e74c3c;
}

/* Dettagli del volo */
.flight-details {
  animation: fadeIn 0.5s ease-out;
}

.card {
  background: linear-gradient(145deg, #2c3e50, #2a3b4d);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.flight-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.flight-airline-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
}

.logo-placeholder {
  text-transform: uppercase;
}

.flight-title h3 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
}

.airline-name {
  font-size: 0.9rem;
  font-weight: normal;
  opacity: 0.8;
}

/* Percorso del volo */
.flight-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0;
  position: relative;
}

.route-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 30%;
}

.airport-code {
  font-size: 1.8rem;
  font-weight: bold;
  color: #3498db;
}

.airport-name {
  font-size: 0.9rem;
  margin-top: 5px;
  opacity: 0.8;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.route-line {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
}

.route-arrow {
  width: 100%;
  height: 20px;
  stroke: #3498db;
}

.flight-status-badge {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.2);
}

.flight-status-badge.status-landed {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.flight-status-badge.status-active {
  background-color: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.flight-status-badge.status-default {
  background-color: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

/* Grid per dettagli del volo */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.detail-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.detail-card strong {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3498db;
  font-size: 1.1rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-icon {
  width: 20px;
  height: 20px;
  stroke: #3498db;
}

.time-large {
  font-size: 2rem;
  font-weight: bold;
  margin: 10px 0 5px;
  color: white;
}

.date {
  font-size: 1rem;
  color: #bdc3c7;
  margin-bottom: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.detail-label {
  color: #bdc3c7;
  font-size: 0.9rem;
}

.detail-value {
  font-weight: 500;
  color: white;
}

/* Pulsante per preferiti */
.favorite-button {
  background-color: transparent;
  border: none;
  color: #bdc3c7;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px;
  margin-left: 15px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.favorite-button:hover {
  color: #f1c40f;
  transform: scale(1.2);
}

.favorite-button.is-favorite {
  color: #f1c40f;
  animation: pulse 1s ease;
}

/* Loading spinner */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px 0;
  animation: fadeIn 0.5s ease-out;
}

.spinner {
  border: 4px solid rgba(52, 152, 219, 0.2);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border-left-color: #3498db;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.loading-spinner p {
  color: #bdc3c7;
  font-size: 1rem;
}

/* Sezione preferiti */
.favorites-section {
  margin-top: 50px;
  animation: fadeIn 0.5s ease-out;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  color: white;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(52, 152, 219, 0.3);
}

.section-icon {
  width: 24px;
  height: 24px;
  color: #f1c40f;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.favorite-card {
  background: linear-gradient(145deg, #273747, #253444);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.favorite-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.favorite-card-header {
  background: rgba(52, 152, 219, 0.1);
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.favorite-card-header h3 {
  font-size: 1.3rem;
  margin: 0;
  color: white;
}

.remove-favorite {
  background: rgba(231, 76, 60, 0.2);
  border: none;
  color: #e74c3c;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.remove-favorite:hover {
  background: rgba(231, 76, 60, 0.4);
  transform: scale(1.1);
}

.favorite-details {
  padding: 20px;
  flex: 1;
}

.favorite-route {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.favorite-route .airport-code {
  font-size: 1.4rem;
}

.favorite-route .route-arrow {
  color: #3498db;
}

.favorite-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-pill {
  font-size: 0.8rem;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.status-pill.status-landed {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.status-pill.status-active {
  background-color: rgba(243, 156, 18, 0.2);
  color: #f39c12;
}

.status-pill.status-default {
  background-color: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.flight-date {
  font-size: 0.9rem;
  color: #bdc3c7;
}

.favorite-times {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.time-badge {
  background: rgba(52, 152, 219, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
}

.time-separator {
  color: #bdc3c7;
}

.view-details-button {
  width: 100%;
  padding: 14px;
  border: none;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.view-details-button:hover {
  background: linear-gradient(135deg, #2980b9, #2173a6);
}

.details-icon {
  width: 18px;
  height: 18px;
  stroke: white;
}

/* Nessun preferito */
.no-favorites {
  text-align: center;
  padding: 40px 30px;
  background: linear-gradient(145deg, #273747, #253444);
  border-radius: 15px;
  margin-top: 40px;
  animation: fadeIn 0.5s ease-out;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.empty-state-icon {
  font-size: 4rem;
  color: #bdc3c7;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.no-favorites p {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.empty-instructions {
  color: #bdc3c7;
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content {
    max-width: 95%;
    margin-top: 80px;
    padding: 0 20px 20px;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .content {
    margin-top: 70px;
    padding: 0 15px 15px;
  }

  .search-form {
    flex-direction: column;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .flight-route {
    flex-direction: column;
    gap: 20px;
  }
  
  .route-point {
    width: 100%;
  }
  
  .route-line {
    width: 100%;
    height: 40px;
    margin: 10px 0;
  }
  
  .route-arrow {
    transform: rotate(90deg);
  }
  
  .flight-title h3 {
    font-size: 1.3rem;
  }
  
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .content {
    margin-top: 60px;
    padding: 0 10px 10px;
  }

  .search-title h2 {
    font-size: 1.3rem;
  }
  
  .search-button {
    padding: 14px 15px;
  }
  
  .card {
    padding: 20px;
  }
  
  .flight-airline-logo {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
  
  .flight-title h3 {
    font-size: 1.1rem;
  }
  
  .airport-code {
    font-size: 1.5rem;
  }
  
  .time-large {
    font-size: 1.6rem;
  }
  
  .detail-card strong {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .no-favorites .empty-state-icon {
    font-size: 3rem;
  }
  
  .no-favorites p {
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  .content {
    margin-top: 50px;
  }
  
  .btn-text {
    display: none;
  }
  
  .search-button {
    padding: 14px;
  }
  
  .favorite-button {
    font-size: 1.5rem;
  }
}
</style>