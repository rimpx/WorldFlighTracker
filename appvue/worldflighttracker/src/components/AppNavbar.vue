<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/success" class="logo" aria-label="Home">
          <span class="logo-icon">✈️</span>
          <span class="logo-text">WORLDFLIGHTTRACKER</span>
          <span class="sr-only">Homepage</span>
        </router-link>
        <div class="user-info">
          <div class="user-avatar">{{ getInitials(accountName) }}</div>
          <div class="user-details">
            <span class="username">Ciao, {{ accountName }}</span>
            <span class="airport">
              <svg xmlns="http://www.w3.org/2000/svg" class="airport-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M22 16.5H2c-.2 0-.4-.1-.6-.2-.2-.1-.3-.4-.3-.6.3-1.8 1.4-3.3 2.9-4.3 1.5-.9 3.4-1.4 5.4-1.4 1 0 1.9.1 2.8.4l3.5-5.2c.1-.2.3-.2.5-.3h.6c.6 0 1 .4 1 1v4.1l1-.3c.2-.1.5-.1.7-.1 1.1 0 2 .9 2 2 0 .2 0 .4-.1.6l-1.3 1.9c1.1.6 2 1.3 2.6 2.2.2.3.2.6.2.8 0 .2-.1.3-.2.4h-.7zM8.4 14.1v-1.6c0-.1 0-.2-.1-.3-.8-.8-2-.8-2.7 0-.1.1-.2.2-.2.3v1.6c0 .2.1.3.2.4 0 0 .1 0 .2.1.1 0 .3 0 .4-.1l.6-.6.6.6c.2.1.3.2.5.1.1 0 .2-.1.3-.1s.2-.2.2-.4z"/>
              </svg>
              {{ favoriteAirport }}
            </span>
          </div>
        </div>
      </div>

      <div class="navbar-actions">
        <!-- Usa router-link per la navigazione all'account -->
        <router-link to="/account" class="nav-btn account-btn" aria-label="Accedi al tuo profilo">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
            <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
            <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
          </svg>
          <span class="btn-text">Account</span>
        </router-link>

        <!-- Pulsante per il logout -->
        <button @click="logout" class="nav-btn logout-btn" aria-label="Esci dall'account">
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
    
    // Nuova funzione per ottenere le iniziali dell'utente per l'avatar
    getInitials(name) {
      if (!name) return '?';
      return name.charAt(0).toUpperCase();
    }
  },
};
</script>

<style scoped>
/* Animazioni */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Accessibilità */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Stile base navbar */
.navbar {
  width: 100%;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  box-shadow: 0 3px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  z-index: 1000;
  animation: fadeIn 0.4s ease-out;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Stile brand e logo */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.logo::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  transition: width 0.3s ease;
}

.logo:hover::after {
  width: 100%;
}

.logo-icon {
  font-size: 1.5rem;
  animation: pulse 2s infinite;
}

.logo-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo:hover .logo-text {
  background: linear-gradient(135deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Stile informazioni utente */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background-color: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.user-info:hover {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.username {
  font-size: 0.9rem;
  color: #34495e;
  font-weight: 600;
}

.airport {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 500;
}

.airport-icon {
  width: 0.9rem;
  height: 0.9rem;
  color: #7f8c8d;
}

/* Stile azioni navbar */
.navbar-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.2rem;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
}

.nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.account-btn {
  color: white;
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.account-btn:hover {
  background: linear-gradient(135deg, #2980b9, #2576a8);
}

.logout-btn {
  color: white;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #c0392b, #a93226);
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
  stroke: currentColor;
}

.btn-text {
  font-weight: 500;
  font-size: 0.9rem;
}

/* Tooltip per pulsanti su mobile */
.nav-btn[aria-label]::before {
  content: attr(aria-label);
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
}

.nav-btn[aria-label]::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-bottom-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .navbar-container {
    padding: 0.8rem 1.5rem;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .navbar-brand {
    gap: 1rem;
  }
  
  .logo-icon {
    font-size: 1.3rem;
  }
  
  .logo-text {
    font-size: 1.1rem;
  }
  
  .username {
    font-size: 0.85rem;
  }
  
  .airport {
    font-size: 0.75rem;
  }
  
  .navbar-actions {
    gap: 0.8rem;
  }
  
  .nav-btn {
    padding: 0.6rem 1rem;
  }
  
  .btn-text {
    font-size: 0.85rem;
  }
}

@media (max-width: 576px) {
  .navbar-container {
    padding: 0.8rem 1rem;
  }
  
  .navbar-brand {
    align-items: center;
  }
  
  .logo-text {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .user-info {
    padding: 0.4rem 0.8rem;
  }
  
  .nav-btn {
    padding: 0.6rem 0.8rem;
  }
  
  .btn-text {
    display: none;
  }
  
  /* Mostra tooltip su mobile quando i testi sono nascosti */
  .nav-btn:hover[aria-label]::before,
  .nav-btn:hover[aria-label]::after {
    opacity: 1;
    visibility: visible;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    justify-content: space-between;
  }
  
  .navbar-brand {
    flex: 1;
    justify-content: flex-start;
  }
  
  .logo-text {
    display: none;
  }
  
  .user-details {
    display: none;
  }
  
  .user-info {
    background: none;
    border: none;
    padding: 0;
    margin-left: auto;
    margin-right: 10px;
  }
  
  .navbar-actions {
    gap: 0.5rem;
  }
  
  .nav-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon {
    width: 1.1rem;
    height: 1.1rem;
  }
}

/* Hamburger menu per dispositivi molto piccoli */
@media (max-width: 360px) {
  .navbar-container {
    padding: 0.6rem 0.8rem;
  }
  
  .logo-icon {
    font-size: 1.3rem;
  }
  
  .user-avatar {
    width: 1.8rem;
    height: 1.8rem;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
  }
  
  .icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>