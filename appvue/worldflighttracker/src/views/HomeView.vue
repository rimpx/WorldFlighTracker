<template>
  <div class="container">
    <div class="login-box">
      <!-- Logo e titolo dell'app -->
      <div class="logo-container">
        <h1 class="app-logo">✈️</h1>
        <div class="app-name">WORLDFLIGHTTRACKER</div>
      </div>
      
      <div class="login-container">
        <h2 class="form-title">{{ isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account' }}</h2>
        
        <form @submit.prevent="isLogin ? loginUser() : registerUser()" class="auth-form">
          <!-- Campi solo per registrazione -->
          <div v-if="!isLogin" class="form-group">
            <div class="input-icon">👤</div>
            <input type="text" v-model="nome" placeholder="Nome" class="input-field" required />
          </div>
          
          <div v-if="!isLogin" class="form-group">
            <div class="input-icon">👤</div>
            <input type="text" v-model="cognome" placeholder="Cognome" class="input-field" required />
          </div>
          
          <div v-if="!isLogin" class="form-group">
            <div class="input-icon">🔢</div>
            <input type="number" v-model="eta" placeholder="Età" class="input-field" required />
          </div>
          
          <div v-if="!isLogin" class="form-group">
            <div class="input-icon">🛫</div>
            <input type="text" v-model="aeroporto_preferenza" placeholder="Aeroporto Preferito (es. FCO)" class="input-field" />
          </div>
          
          <!-- Campi comuni -->
          <div class="form-group">
            <div class="input-icon">📧</div>
            <input type="email" v-model="email" placeholder="Email" class="input-field" required />
          </div>
          
          <div class="form-group">
            <div class="input-icon">🔒</div>
            <input type="password" v-model="password" placeholder="Password" class="input-field" required />
          </div>
          
          <button type="submit" class="login-button">
            {{ isLogin ? 'Accedi' : 'Registrati' }}
          </button>
        </form>
        
        <div class="toggle-section">
          <button @click.prevent="toggleMode" class="toggle-button">
            {{ isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi' }}
          </button>
        </div>

        <!-- Separatore -->
        <div class="separator">
          <span>oppure</span>
        </div>

        <!-- Login con Google -->
        <div class="social-login">
          <GoogleLogin 
            :callback="handleGoogleLogin" 
            client-id="564606231029-f491m38591t9i831cntsg6jjhdp2vter.apps.googleusercontent.com" 
            class="google-button" 
            auto_select="false"
          >
            <div class="google-button-content">
              <svg class="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              <span>Continua con Google</span>
            </div>
          </GoogleLogin>
        </div>

        <!-- Messaggi di feedback -->
        <div v-if="message" class="message-container" :class="{ 'error-message': isError, 'success-message': !isError }">
          <div class="message-icon">{{ isError ? '❌' : '✅' }}</div>
          <p class="message-text">{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GoogleLogin } from 'vue3-google-login';
// Rimosso l'import di socket.io-client

export default {
  components: {
    GoogleLogin
  },
  data() {
    return {
      isLogin: true,
      nome: "",
      cognome: "",
      eta: "",
      aeroporto_preferenza: "",
      email: "",
      password: "",
      message: "",
      isError: false
      // Rimossa la proprietà socket
    };
  },
  // Rimosso il metodo mounted() per la connessione WebSocket
  // Rimosso il metodo beforeUnmount() per la disconnessione WebSocket
  methods: {
    toggleMode() {
      this.isLogin = !this.isLogin;
      this.clearForm();
      this.message = "";
    },
    clearForm() {
      this.nome = "";
      this.cognome = "";
      this.eta = "";
      this.aeroporto_preferenza = "";
      this.email = "";
      this.password = "";
    },
    async registerUser() {
      try {
        const userData = {
          username: this.nome + this.cognome,
          email: this.email,
          password: this.password,
          age: this.eta,
          favorite_airport: this.aeroporto_preferenza
        };

        // Determina l'URL base in modo dinamico
        const apiBaseUrl = this.getApiBaseUrl();

        const response = await fetch(`${apiBaseUrl}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.message = data.message || "Registrazione avvenuta con successo! Ora puoi accedere.";
        this.isError = false;
        this.toggleMode(); 
      } catch (error) {
        this.message = "Errore durante la registrazione: " + error.message;
        this.isError = true;
      }
    },
    async loginUser() {
      try {
        const loginData = {
          email: this.email,
          password: this.password
        };

        // Determina l'URL base in modo dinamico
        const apiBaseUrl = this.getApiBaseUrl();

        const response = await fetch(`${apiBaseUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.message = data.message || "Login effettuato con successo!";
        this.isError = false;

        sessionStorage.setItem("accountName", data.user.username);
        sessionStorage.setItem("isAdmin", data.user.is_admin ? "true" : "false");
        localStorage.setItem("user-token", "valid-token");

        this.$router.push(data.user.is_admin ? "/admin" : "/success");
      } catch (error) {
        this.message = "Errore nel login: " + error.message;
        this.isError = true;
      }
    },
    async handleGoogleLogin(response) {
      console.log("Token ID ricevuto:", response.credential);
      try {
        // Determina l'URL base in modo dinamico
        const apiBaseUrl = this.getApiBaseUrl();
        
        const backendResponse = await fetch(`${apiBaseUrl}/login/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token: response.credential })
        });

        if (!backendResponse.ok) {
          throw new Error(`Errore HTTP: ${backendResponse.status}`);
        }
        const data = await backendResponse.json();
        this.message = data.message || "Login con Google effettuato!";
        this.isError = false;

        sessionStorage.setItem("accountName", data.user.username);
        sessionStorage.setItem("isAdmin", data.user.is_admin ? "true" : "false");
        localStorage.setItem("user-token", "valid-token");

        this.$router.push(data.user.is_admin ? "/admin" : "/success");
      } catch (error) {
        console.error("Errore nel login con Google:", error);
        this.message = "Errore nel login con Google: " + error.message;
        this.isError = true;
      }
    },
    // Nuovo metodo per determinare l'URL API base
    getApiBaseUrl() {
      const isHttps = window.location.protocol === 'https:';
      
      if (window.location.host.includes('.app.github.dev') || isHttps) {
        const hostParts = window.location.host.split('-');
        if (hostParts.length > 1) {
          const portIndex = hostParts.length - 1;
          hostParts[portIndex] = '3000';
          return `${window.location.protocol}//${hostParts.join('-')}.app.github.dev`;
        } else {
          return `${window.location.protocol}//${window.location.hostname}:3000`;
        }
      } else {
        return 'http://localhost:3000';
      }
    }
  }
};
</script>

<style scoped>
/* Base e animazioni */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Stili di base */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  font-family: 'Segoe UI', Arial, sans-serif;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.8s ease-out;
}

/* Logo e titolo */
.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.app-logo {
  font-size: 3rem;
  margin: 0;
  animation: pulse 2s infinite;
}

.app-name {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  margin-top: 10px;
}

/* Form container */
.login-container {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 30px;
  overflow: hidden;
}

.form-title {
  color: #2a5298;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 30px;
  font-weight: 600;
}

/* Campi di input */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  font-size: 1.2rem;
  color: #2a5298;
}

.input-field {
  width: 100%;
  padding: 16px 16px 16px 50px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  color: #495057;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #2a5298;
  box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.2);
  outline: none;
}

.input-field::placeholder {
  color: #adb5bd;
}

/* Pulsanti */
.login-button {
  padding: 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #2a5298, #1e3c72);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.login-button:active {
  transform: translateY(0);
}

.toggle-section {
  text-align: center;
  margin: 20px 0;
}

.toggle-button {
  background: none;
  border: none;
  color: #2a5298;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px 12px;
  transition: color 0.3s;
  font-weight: 500;
}

.toggle-button:hover {
  color: #1e3c72;
  text-decoration: underline;
}

/* Separatore */
.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.separator span {
  padding: 0 10px;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Google login */
.social-login {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.google-button {
  width: 100%;
  max-width: 320px;
  cursor: pointer;
}

.google-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: white;
  color: #757575;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.google-button-content:hover {
  background-color: #f8f9fa;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

.google-icon {
  width: 24px;
  height: 24px;
}

/* Messaggi di successo/errore */
.message-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
  animation: fadeIn 0.5s ease-out;
}

.error-message {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border-left: 4px solid #f44336;
}

.success-message {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border-left: 4px solid #4caf50;
}

.message-icon {
  font-size: 1.2rem;
}

.message-text {
  margin: 0;
  font-size: 0.95rem;
}

/* Responsive design */
@media (min-width: 768px) {
  .login-container {
    padding: 40px 60px;
  }
  
  .auth-form {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 767px) {
  .app-name {
    font-size: 1.6rem;
  }
  
  .form-title {
    font-size: 1.3rem;
  }
  
  .login-container {
    padding: 25px;
  }
  
  .input-field {
    padding: 14px 14px 14px 45px;
  }
  
  .login-button {
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .app-name {
    font-size: 1.3rem;
  }
  
  .form-title {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }
  
  .login-container {
    padding: 20px 15px;
  }
  
  .input-field {
    padding: 12px 12px 12px 40px;
    font-size: 0.9rem;
  }
  
  .input-icon {
    font-size: 1rem;
    left: 12px;
  }
  
  .login-button, 
  .google-button-content {
    padding: 12px;
    font-size: 0.9rem;
  }
  
  .message-container {
    padding: 12px;
  }
  
  .message-text {
    font-size: 0.85rem;
  }
}
</style>