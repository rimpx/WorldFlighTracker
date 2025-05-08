<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/success" class="logo">WORLDFLIGHTTRACKER</router-link>
        <div class="user-info">
          <span class="username">Ciao, {{ accountName }}</span>
          <span class="airport">{{ favoriteAirport }}</span>
        </div>
      </div>

      <div class="navbar-actions">
        <!-- Usa router-link per la navigazione all'account -->
        <router-link to="/account" class="nav-btn account-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
            <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
          </svg>
          <span class="btn-text">Account</span>
        </router-link>

        <!-- Pulsante per il logout -->
        <button @click="logout" class="nav-btn logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
            <path d="M7 12h14l-3 -3m0 6l3 -3"></path>
          </svg>
          <span class="btn-text">Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppNavbar",
  props: ["accountName", "favoriteAirport"],
  methods: {
    // Funzione per determinare dinamicamente l'URL base dell'API
    getApiBaseUrl() {
      // Se siamo in GitHub Codespaces
      if (window.location.host.includes('.app.github.dev')) {
        // Estrai il prefisso del nome host
        const prefix = window.location.host.split('-')[0];
        // Costruisci l'URL completo per Codespaces
        return `${window.location.protocol}//${prefix}-3000.app.github.dev`;
      } else {
        // URL di sviluppo locale predefinito
        return 'http://localhost:3000';
      }
    },
    
    async logout() {
      try {
        const apiBaseUrl = this.getApiBaseUrl();
        console.log(`Esecuzione logout su: ${apiBaseUrl}/logout`);
        
        const response = await fetch(`${apiBaseUrl}/logout`, {
          method: "POST",
          credentials: "include",
        });
        
        if (response.ok) {
          sessionStorage.clear();
          localStorage.removeItem("user-token");
          this.$router.push("/");
        } else {
          console.error(`Errore durante il logout: ${response.status}`);
          // Forza comunque il logout sul client anche in caso di errore dal server
          sessionStorage.clear();
          localStorage.removeItem("user-token");
          this.$router.push("/");
        }
      } catch (error) {
        console.error("Errore durante il logout:", error);
        // Forza comunque il logout sul client in caso di errore
        sessionStorage.clear();
        localStorage.removeItem("user-token");
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  width: 100%;
  background: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #3498db;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.username {
  font-size: 0.95rem;
  color: #34495e;
  font-weight: 500;
}

.airport {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.navbar-actions {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none; /* Rimuovi la sottolineatura per i link */
}

.nav-btn:hover {
  transform: translateY(-1px);
}

.account-btn {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
}

.account-btn:hover {
  background-color: rgba(52, 152, 219, 0.2);
}

.logout-btn {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

.logout-btn:hover {
  background-color: rgba(231, 76, 60, 0.2);
}

.icon {
  width: 1.4rem;
  height: 1.4rem;
  stroke: currentColor;
}

.btn-text {
  font-weight: 500;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .navbar-container {
    padding: 0.8rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .navbar-brand {
    gap: 1rem;
  }

  .logo {
    font-size: 1.2rem;
  }

  .username {
    font-size: 0.9rem;
  }

  .airport {
    font-size: 0.8rem;
  }

  .navbar-actions {
    gap: 1rem;
  }

  .nav-btn {
    padding: 0.5rem 1rem;
  }

  .btn-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }

  .navbar-brand {
    width: 100%;
    justify-content: space-between;
  }

  .navbar-actions {
    width: 100%;
    justify-content: space-between;
  }

  .btn-text {
    display: none;
  }

  .nav-btn {
    padding: 0.6rem;
    justify-content: center;
    width: 48%;
  }

  .icon {
    width: 1.2rem;
    height: 1.2rem;
  }
}

@media (max-width: 400px) {
  .airport {
    display: none;
  }
}
</style>