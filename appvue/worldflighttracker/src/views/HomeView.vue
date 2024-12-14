<template>
  <div class="container">
    <div class="app-name">
      WORLDFLIGHTTRACKER
    </div>
    <div class="login-container">
      <h2>Accedi o Registrati</h2>
      <form @submit.prevent="isLogin ? loginUser() : registerUser()">
        <input v-if="!isLogin" type="text" v-model="nome" placeholder="Nome" class="input-field" required />
        <input v-if="!isLogin" type="text" v-model="cognome" placeholder="Cognome" class="input-field" required />
        <input v-if="!isLogin" type="number" v-model="eta" placeholder="Età" class="input-field" required />
        <input v-if="!isLogin" type="text" v-model="aeroporto_preferenza" placeholder="Aeroporto Preferito"
          class="input-field" />
        <input type="email" v-model="email" placeholder="Email" class="input-field" required />
        <input type="password" v-model="password" placeholder="Password" class="input-field" required />
        <button type="submit" class="login-button">
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
        <button @click.prevent="toggleMode" class="toggle-button">
          {{ isLogin ? 'Passa a Registrati' : 'Passa a Login' }}
        </button>
        <p v-if="message" :class="{ 'error-message': isError, 'success-message': !isError }">
          {{ message }}
        </p>
      </form>
    </div>
  </div>
</template>

<script>
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
      isError: false,
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
        username: this.nome,  // Mappato a 'username' per il server
        email: this.email,
        password: this.password,
        age: this.eta,  // Mappato a 'age'
        favorite_airport: this.aeroporto_preferenza, // Mappato a 'favorite_airport'
      };

      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
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
        password: this.password,
      };

      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
          credentials: "include", // Include i cookie
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.message = data.message || "Login effettuato con successo!";
        this.isError = false;

        // Salva il token o aggiorna sessionStorage
        sessionStorage.setItem("accountName", data.user.username);
        localStorage.setItem("user-token", "valid-token"); // Token fittizio per autenticazione

        // Reindirizza alla pagina successiva
        this.$router.push("/success");
      } catch (error) {
        this.message = "Errore nel login: " + error.message;
        this.isError = true;
      }
    }
    ,
  },
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #000;
  color: #fff;
}

.app-name {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.login-container {
  background-color: #333;
  padding: 20px;
  border-radius: 8px;
  max-width: 350px;
  width: 100%;
  text-align: center;
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
</style>