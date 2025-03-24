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
import io from "socket.io-client"; // Importa Socket.IO

export default {
  name: "SuccessPage",
  components: { Navbar },
  data() {
    return {
      flightCode: "",
      flightDetails: null,
      errorMessage: "",
      socket: null, // Aggiungi socket come variabile
    };
  },
  async mounted() {
    try {
      await fetchUserData();
      this.loadFlightDetailsFromStorage();

      // Connessione al server WebSocket
      this.socket = io("http://localhost:3000", {
        withCredentials: true, // Invia i cookie di sessione
      });

      // Notifica al server che l'utente è online
      this.socket.emit("user_online");

      // Gestione della disconnessione
      this.socket.on("disconnect", () => {
        console.log("Disconnesso dal server WebSocket");
      });
    } catch (error) {
      alert("Errore nel recupero delle informazioni utente.");
      this.$router.push("/");
    }
  },
  beforeUnmount() {
    // Chiudi la connessione WebSocket quando il componente viene smontato
    if (this.socket) {
      this.socket.disconnect();
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
    saveFlightDetailsToStorage() {
      localStorage.setItem("flightDetails", JSON.stringify(this.flightDetails));
    },
    loadFlightDetailsFromStorage() {
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
  font-family: Arial, sans-serif;
  color: white;
  padding: 0; /* Padding rimosso per allineare la navbar */
}

.content {
  width: 100%;
  max-width: 1400px; /* Allineato alla larghezza della navbar */
  margin: 80px auto 0; /* Margine superiore per la navbar */
  padding: 0 20px 20px; /* Padding laterale e inferiore */
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
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

strong {
  color: #4CAF50;
  display: block;
  margin-bottom: 5px;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .content {
    max-width: 95%;
    margin-top: 70px;
  }

  .grid {
    gap: 15px;
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