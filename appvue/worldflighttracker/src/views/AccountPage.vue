<template>
  <div class="container">
    <!-- Navbar riutilizzabile -->
    <Navbar :accountName="user.username" :favoriteAirport="user.favorite_airport" />

    <!-- Contenuto principale -->
    <div class="account-container">
      <div class="page-header">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h1 class="page-title">Gestione Profilo</h1>
      </div>
      
      <div class="profile-content">
        <!-- Informazioni utente -->
        <div class="info-section card-effect">
          <div class="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <h2>Informazioni Account</h2>
          </div>
          
          <div class="user-avatar">
            <div class="avatar-circle">
              {{ user.username ? user.username.charAt(0).toUpperCase() : '?' }}
            </div>
            <div class="user-username">{{ user.username }}</div>
          </div>
          
          <ul class="info-list">
            <li class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Email</div>
                <div class="info-value">{{ user.email }}</div>
              </div>
            </li>
            
            <li class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Età</div>
                <div class="info-value">{{ user.age }} anni</div>
              </div>
            </li>
            
            <li class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div class="info-content">
                <div class="info-label">Aeroporto Preferito</div>
                <div class="info-value">
                  <span class="airport-badge">{{ user.favorite_airport || 'Non impostato' }}</span>
                </div>
              </div>
            </li>
          </ul>
          
          <div v-if="successMessage" class="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{{ successMessage }}</span>
          </div>
        </div>

        <!-- Modifica informazioni -->
        <div class="edit-section card-effect">
          <div class="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <h2>Modifica Informazioni</h2>
          </div>
          
          <div class="form-group">
            <label for="airport">Nuovo Aeroporto Preferito</label>
            <div class="input-wrapper">
              <div class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <input v-model="updatedAirport" id="airport" placeholder="Inserisci codice aeroporto (es. FCO)" class="styled-input" />
            </div>
            <button @click="updateAirport" class="update-button airport-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Aggiorna Aeroporto
            </button>
          </div>
          
          <div class="password-section">
            <div class="section-divider">
              <span>Cambia Password</span>
            </div>
            
            <div class="form-group">
              <label for="password">Nuova Password</label>
              <div class="input-wrapper">
                <div class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input type="password" v-model="newPassword" id="password" placeholder="Inserisci la nuova password" class="styled-input" />
              </div>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Conferma Password</label>
              <div class="input-wrapper">
                <div class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <input
                  type="password"
                  v-model="confirmPassword"
                  id="confirmPassword"
                  placeholder="Conferma la nuova password"
                  class="styled-input"
                />
              </div>
              <button @click="updatePassword" class="update-button password-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  <line x1="12" y1="16" x2="12" y2="16"></line>
                </svg>
                Cambia Password
              </button>
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
// Rimosso l'import di socket.io-client

export default {
  name: "AccountPage",
  components: { Navbar },
  data() {
    return {
      updatedAirport: "",
      newPassword: "",
      confirmPassword: "",
      successMessage: "",
      apiBaseUrl: "" // Aggiunto per configurare l'URL dell'API
    };
  },
  async mounted() {
    try {
      // Configura l'URL dell'API base
      this.configureApiBaseUrl();
      
      await fetchUserData();
      this.updatedAirport = this.user.favorite_airport;
      
      // Rimossa l'inizializzazione della connessione WebSocket
    } catch (error) {
      console.error("Errore nel recupero delle informazioni utente:", error);
      alert("Errore nel recupero delle informazioni utente.");
    }
  },
  // Rimosso il metodo beforeUnmount() per la disconnessione WebSocket
  computed: {
    user() {
      return useAuth().user.value;
    },
  },
  methods: {
    // Aggiunto metodo per configurare l'URL dell'API
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
  
    async updateAirport() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/update-airport`, {
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
        const response = await fetch(`${this.apiBaseUrl}/update-password`, {
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
/* Animazioni */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Layout di base */
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: white;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.account-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 30px 50px;
  animation: fadeIn 0.5s ease-out;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
}

.header-icon svg {
  width: 28px;
  height: 28px;
  stroke: white;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: white;
  letter-spacing: 0.5px;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
}

/* Effetto carta */
.card-effect {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
}

.card-effect:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transform: translateY(-5px);
}

/* Sezione informazioni */
.info-section {
  padding: 25px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-icon {
  width: 22px;
  height: 22px;
  stroke: #3b82f6;
}

.section-header h2 {
  margin: 0;
  font-size: 1.3rem;
  color: white;
  font-weight: 600;
  border-bottom: none;
  padding-bottom: 0;
}

.user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
}

.user-username {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.info-icon {
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon svg {
  width: 20px;
  height: 20px;
  stroke: #3b82f6;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 5px;
}

.info-value {
  font-size: 1rem;
  color: white;
  font-weight: 500;
}

.airport-badge {
  display: inline-block;
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  animation: slideIn 0.3s ease-out;
  font-weight: 500;
}

.success-icon {
  width: 20px;
  height: 20px;
  stroke: #10b981;
}

/* Sezione modifica */
.edit-section {
  padding: 25px;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.input-icon {
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-icon svg {
  width: 18px;
  height: 18px;
  stroke: #3b82f6;
}

.styled-input {
  width: 100%;
  padding: 14px 14px 14px 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.styled-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

.styled-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.update-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: white;
}

.button-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.airport-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.airport-button:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.password-button {
  background: linear-gradient(135deg, #10b981, #059669);
}

.password-button:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.section-divider {
  display: flex;
  align-items: center;
  margin: 30px 0 20px;
}

.section-divider::before,
.section-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-divider span {
  padding: 0 15px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 992px) {
  .profile-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .page-header {
    justify-content: center;
    margin-bottom: 40px;
  }
}

@media (max-width: 768px) {
  .account-container {
    padding: 100px 20px 40px;
  }
  
  .page-title {
    font-size: 1.6rem;
  }
  
  .header-icon {
    width: 45px;
    height: 45px;
  }
  
  .header-icon svg {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 576px) {
  .account-container {
    padding: 80px 15px 30px;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .info-item {
    padding: 12px;
  }
  
  .info-icon {
    width: 35px;
    height: 35px;
  }
  
  .info-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .info-label {
    font-size: 0.8rem;
  }
  
  .info-value {
    font-size: 0.95rem;
  }
  
  .avatar-circle {
    width: 70px;
    height: 70px;
    font-size: 1.7rem;
  }
  
  .user-username {
    font-size: 1.1rem;
  }
  
  .section-header h2 {
    font-size: 1.2rem;
  }
  
  .styled-input {
    padding: 12px 12px 12px 40px;
    font-size: 0.9rem;
  }
  
  .update-button {
    padding: 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .header-icon {
    width: 40px;
    height: 40px;
  }
  
  .header-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .page-title {
    font-size: 1.2rem;
  }
  
  .info-section,
  .edit-section {
    padding: 20px;
  }
  
  .avatar-circle {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}
</style>