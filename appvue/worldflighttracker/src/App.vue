<template>
  <div class="container">
    <h1>{{ isLogin ? "Login" : "Register" }}</h1>

    <form @submit.prevent="isLogin ? loginUser() : registerUser()">
      <div v-if="!isLogin">
        <input type="text" v-model="nome" placeholder="Nome" required />
        <input type="text" v-model="cognome" placeholder="Cognome" required />
        <input type="number" v-model="eta" placeholder="Età" required min="16" />
        <input type="text" v-model="aeroporto_preferenza" placeholder="Aeroporto di Preferenza" required />
      </div>
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />

      <button type="submit">{{ isLogin ? "Login" : "Register" }}</button>
    </form>

    <p @click="toggleMode">
      {{ isLogin ? "Non hai un account? Registrati" : "Hai già un account? Accedi" }}
    </p>

    <p v-if="message">{{ message }}</p>
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
      message: ""
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
        const response = await fetch('http://www.rimpici.it/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.message = data.message || "Registrazione avvenuta con successo!";
      } catch (error) {
        this.message = "Errore nella registrazione: " + error.message;
      }
    },
  async loginUser() {
      const loginData = {
        email: this.email,
        password: this.password
      };

      try {
        const response = await fetch('http://www.rimpici.it/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.message = data.message || "Login effettuato con successo!";
      } catch (error) {
        this.message = "Errore nel login: " + error.message;
      }
    }
  }
};
</script>

<style scoped>
body {
  background-color: black;
  color: white;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  max-width: 400px;
  width: 100%;
  margin: auto;
  padding: 20px;
  background-color: #333;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  margin-bottom: 20px;
  font-weight: bold;
  color: white;
}

form input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: none;
  box-sizing: border-box;
}

form button {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
}

form button:hover {
  background-color: #0056b3;
}
p {
  margin-top: 10px;
  cursor: pointer;
  color: #bbb;
}

p:hover {
  color: white;
}
</style>
