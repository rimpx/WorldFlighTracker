<template>
  <div class="container">
    <div class="app-name">
      WORLDFLIGHTTRACKER
    </div>
    <div class="login-container">
      <h2>Accedi o Registrati</h2>
      <form @submit.prevent="isLogin ? loginUser() : registerUser()">
        <input
          v-if="!isLogin"
          type="text"
          v-model="nome"
          placeholder="Nome"
          class="input-field"
          required
        />
        <input
          v-if="!isLogin"
          type="text"
          v-model="cognome"
          placeholder="Cognome"
          class="input-field"
          required
        />
        <input
          v-if="!isLogin"
          type="number"
          v-model="eta"
          placeholder="Età"
          class="input-field"
          required
        />
        <input
          v-if="!isLogin"
          type="text"
          v-model="aeroporto_preferenza"
          placeholder="Aeroporto Preferito"
          class="input-field"
        />
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          class="input-field"
          required
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          class="input-field"
          required
        />
        <button type="submit" class="login-button">{{ isLogin ? 'Login' : 'Register' }}</button>
        <button @click.prevent="toggleMode" class="toggle-button">
          {{ isLogin ? 'Passa a Registrati' : 'Passa a Login' }}
        </button>
        <p v-if="message" :class="{ 'error-message': isError, 'success-message': !isError }">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { login } from '@/auth.js';

export default {
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
      const userData = {
        nome: this.nome,
        cognome: this.cognome,
        eta: this.eta,
        email: this.email,
        password: this.password,
        aeroporto_preferenza: this.aeroporto_preferenza
      };

      try {
        const response = await fetch('https://www.rimpici.it/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.message = data.message || "Registrazione avvenuta con successo! Ora puoi accedere.";
        this.isError = false;
        this.toggleMode(); // Passa alla modalità login
      } catch (error) {
        this.message = "Errore durante la registrazione: " + error.message;
        this.isError = true;
      }
    },
    async loginUser() {
      const loginData = {
        email: this.email,
        password: this.password
      };

      try {
        const response = await fetch('https://www.rimpici.it/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.message = data.message || "Login effettuato con successo!";
        this.isError = false;

        // Imposta autenticazione e reindirizza
        login();
        this.$router.push('/success');
      } catch (error) {
        this.message = "Errore nel login: " + error.message;
        this.isError = true;
      }
    }
  }
};
</script>

<style scoped>
/* Stili di base per la container */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background-color: #000;
  color: #fff;
  box-sizing: border-box;
}

.app-name {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20px; /* Distanza tra il titolo e la box */
  text-align: center; /* Centrato per dispositivi mobili */
  width: 100%;
  max-width: 350px; /* Imposta una larghezza massima per desktop */
}

/* Contenitore di login */
.login-container {
  background-color: #333;
  padding: 20px;
  border-radius: 8px;
  max-width: 350px;
  width: 100%;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #fff;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: none;
  box-sizing: border-box;
}

.login-button,
.toggle-button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
}

.login-button {
  background-color: #007bff;
}

.toggle-button {
  background-color: #555;
}

.error-message {
  color: #ff4d4f;
}

.success-message {
  color: #4caf50;
}

/* Layout per dispositivi desktop */
@media (min-width: 768px) {
  .container {
    flex-direction: row; /* Align items horizontally */
    justify-content: flex-start; /* Sposta gli elementi a sinistra */
    padding-left: 40px; /* Distanza tra il bordo sinistro e il contenuto */
  }

  .app-name {
    margin-right: 40px; /* Aumenta la distanza tra il titolo e la box */
    text-align: left; /* Allinea il testo a sinistra */
    font-size: 2.5rem; /* Dimensione titolo più grande per desktop */
  }

  .login-container {
    margin-left: 40px; /* Aumenta la distanza tra il form e il titolo */
    text-align: left; /* Allinea il form a sinistra */
    width: auto;
  }
}

/* Layout per dispositivi mobili */
@media (max-width: 768px) {
  .container {
    flex-direction: column; /* Allinea gli elementi in colonna per dispositivi mobili */
    justify-content: center;
  }

  .app-name {
    font-size: 1.8rem; /* Rimpicciolisce il titolo per dispositivi mobili */
    text-align: center; /* Allinea il testo al centro */
    margin-bottom: 15px; /* Distanza tra il titolo e la box */
  }

  .login-container {
    max-width: 100%;
    padding: 15px;
  }
}
</style>
