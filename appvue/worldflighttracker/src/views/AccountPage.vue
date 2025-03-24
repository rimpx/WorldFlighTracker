<template>
    <div class="container">
      <!-- Navbar riutilizzabile -->
      <Navbar :accountName="user.username" :favoriteAirport="user.favorite_airport" />
  
      <!-- Contenuto principale -->
      <div class="account-container">
        <!-- Informazioni utente -->
        <div class="info-section">
          <h2>Informazioni Account</h2>
          <ul>
            <li><strong>Username:</strong> {{ user.username }}</li>
            <li><strong>Email:</strong> {{ user.email }}</li>
            <li><strong>Età:</strong> {{ user.age }}</li>
            <li><strong>Aeroporto Preferito:</strong> {{ user.favorite_airport }}</li>
          </ul>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </div>
  
        <!-- Modifica informazioni -->
        <div class="edit-section">
          <h2>Modifica Informazioni</h2>
          <div class="form-group">
            <label for="airport">Nuovo Aeroporto Preferito</label>
            <input v-model="updatedAirport" id="airport" placeholder="Nuovo aeroporto" />
            <button @click="updateAirport" class="update-button">Aggiorna Aeroporto</button>
          </div>
          <div class="form-group">
            <label for="password">Nuova Password</label>
            <input type="password" v-model="newPassword" id="password" placeholder="Nuova password" />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Conferma Password</label>
            <input
              type="password"
              v-model="confirmPassword"
              id="confirmPassword"
              placeholder="Conferma password"
            />
            <button @click="updatePassword" class="update-button">Cambia Password</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from "@/components/AppNavbar.vue";
import { fetchUserData, useAuth } from "@/composables/useAuth";
import io from "socket.io-client"; // Importa Socket.IO

export default {
  name: "AccountPage",
  components: { Navbar },
  data() {
    return {
      updatedAirport: "",
      newPassword: "",
      confirmPassword: "",
      successMessage: "",
      socket: null, // Aggiungi socket come variabile
    };
  },
  async mounted() {
    await fetchUserData();
    this.updatedAirport = this.user.favorite_airport;

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
  },
  methods: {
    async updateAirport() {
      try {
        const response = await fetch("http://localhost:3000/update-airport", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ airport: this.updatedAirport }),
        });

        if (response.ok) {
          this.successMessage = "Aeroporto aggiornato con successo!";
          await fetchUserData();
        } else {
          alert("Errore nell'aggiornamento dell'aeroporto.");
        }
      } catch (error) {
        console.error("Errore aggiornamento aeroporto:", error.message);
      }
    },
    async updatePassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert("Le password non coincidono!");
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/update-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ password: this.newPassword }),
        });

        if (response.ok) {
          this.successMessage = "Password aggiornata con successo!";
          this.newPassword = "";
          this.confirmPassword = "";
        } else {
          alert("Errore nell'aggiornamento della password.");
        }
      } catch (error) {
        console.error("Errore aggiornamento password:", error.message);
      }
    },
  },
};
  </script>
  

<style scoped>
/* Stili base */
.container {
    min-height: 100vh;
    background-color: #1a1a1a;
    color: white;
    font-family: 'Arial', sans-serif;
}

.account-container {
    display: flex;
    gap: 30px;
    padding: 30px 5%;
    flex-wrap: wrap;
}

.info-section,
.edit-section {
    background-color: #2c2c2c;
    border-radius: 12px;
    padding: 25px;
    flex: 1;
    min-width: 300px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

h2 {
    color: #4CAF50;
    margin-bottom: 20px;
    font-size: 1.5rem;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 10px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin: 15px 0;
    padding: 12px;
    background-color: #333;
    border-radius: 6px;
}

strong {
    color: #4CAF50;
    margin-right: 8px;
}

.form-group {
    margin: 20px 0;
}

input {
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 2px solid #4CAF50;
    border-radius: 6px;
    background-color: #333;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

input:focus {
    border-color: #45a049;
    outline: none;
    box-shadow: 0 0 8px rgba(76,175,80,0.3);
}

.update-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    width: 100%;
}

.update-button:hover {
    background-color: #45a049;
    transform: translateY(-2px);
}

.success-message {
    color: #45a049;
    margin-top: 15px;
    padding: 12px;
    background-color: rgba(69,160,73,0.1);
    border-radius: 6px;
    text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
    .account-container {
        flex-direction: column;
        gap: 25px;
        padding: 25px;
    }

    .info-section,
    .edit-section {
        min-width: auto;
        width: 100%;
    }

    h2 {
        font-size: 1.3rem;
    }
}

@media (max-width: 480px) {
    .account-container {
        padding: 15px;
    }

    li {
        font-size: 0.9rem;
        padding: 10px;
    }

    input {
        padding: 10px;
        font-size: 0.9rem;
    }

    .update-button {
        padding: 10px 20px;
        font-size: 0.9rem;
    }

    h2 {
        font-size: 1.2rem;
    }
}

@media (max-width: 360px) {
    .account-container {
        padding: 10px;
    }

    .info-section,
    .edit-section {
        padding: 15px;
    }
}
</style>