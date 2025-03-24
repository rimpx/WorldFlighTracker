<template>
  <div class="container">
    <div class="app-name">WORLDFLIGHTTRACKER</div>
    <div class="login-container">
      <h2>{{ isLogin ? 'Accedi' : 'Registrati' }}</h2>
      <form @submit.prevent="isLogin ? loginUser() : registerUser()">
        <input v-if="!isLogin" type="text" v-model="nome" placeholder="Nome" class="input-field" required />
        <input v-if="!isLogin" type="text" v-model="cognome" placeholder="Cognome" class="input-field" required />
        <input v-if="!isLogin" type="number" v-model="eta" placeholder="Età" class="input-field" required />
        <input v-if="!isLogin" type="text" v-model="aeroporto_preferenza" placeholder="Aeroporto Preferito" class="input-field" />
        <input type="email" v-model="email" placeholder="Email" class="input-field" required />
        <input type="password" v-model="password" placeholder="Password" class="input-field" required />
        <button type="submit" class="login-button">
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
        <button @click.prevent="toggleMode" class="toggle-button">
          {{ isLogin ? 'Passa a Registrati' : 'Passa a Login' }}
        </button>
      </form>

      <!-- Pulsante Login con Google -->
      <GoogleLogin 
        :callback="handleGoogleLogin" 
        client-id="564606231029-f491m38591t9i831cntsg6jjhdp2vter.apps.googleusercontent.com" 
        class="google-button" 
        auto_select="false"
      />

      <p v-if="message" :class="{ 'error-message': isError, 'success-message': !isError }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import { GoogleLogin } from 'vue3-google-login';

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
    };
  },
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

        const response = await fetch("http://localhost:3000/register", {
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

        const response = await fetch("http://localhost:3000/login", {
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
        const backendResponse = await fetch("http://localhost:3000/login/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Permette la gestione della sessione
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
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1a1a1a;
  color: #fff;
  font-family: 'Arial', sans-serif;
  padding: 20px; /* Aggiunto padding per dispositivi mobili */
}

.app-name {
  font-size: 2rem; /* Ridotto per dispositivi mobili */
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center; /* Centrato il testo */
}

.login-container {
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #fff;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #444;
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  max-width: 300px;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.login-button,
.toggle-button {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  max-width: 300px;
}

.login-button {
  background-color: #007bff;
}

.login-button:hover {
  background-color: #005bb5;
}

.toggle-button {
  background-color: #555;
}

.toggle-button:hover {
  background-color: #444;
}

.google-button {
  margin-top: 15px;
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  max-width: 300px;
}

.google-button:hover {
  background-color: #f1f1f1;
}

.error-message {
  color: #ff4d4f;
  margin-top: 15px;
}

.success-message {
  color: #4caf50;
  margin-top: 15px;
}

/* Media Queries per dispositivi mobili */
@media (max-width: 768px) {
  .app-name {
    font-size: 1.5rem; /* Ridotto ulteriormente per schermi piccoli */
  }

  .login-container {
    padding: 15px; /* Ridotto il padding */
    max-width: 90%; /* Larghezza massima ridotta */
  }

  .input-field,
  .login-button,
  .toggle-button,
  .google-button {
    max-width: 100%; /* Larghezza massima al 100% per dispositivi mobili */
  }

  h2 {
    font-size: 1.2rem; /* Ridotto per dispositivi mobili */
  }
}
</style>