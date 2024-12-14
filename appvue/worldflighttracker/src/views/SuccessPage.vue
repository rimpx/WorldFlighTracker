<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-left">
        <span>Ciao, {{ accountName }}</span>
      </div>
      <div class="navbar-right">
        <button @click="logout" class="logout-button">Logout</button>
      </div>
    </nav>
    <div class="content">
      <h1>Login avvenuto con successo!</h1>
      <p>Benvenuto! Hai effettuato l'accesso con successo.</p>
      <button @click="navigateHome" class="home-button">Vai alla Home</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SuccessPage",
  data() {
    return {
      accountName: "", // Nome utente aggiornato dopo il login
    };
  },
  async mounted() {
    // Recupera il nome utente dal sessionStorage o dal localStorage se presente
    const storedAccountName = sessionStorage.getItem("accountName") || localStorage.getItem("accountName");
    if (storedAccountName) {
      this.accountName = storedAccountName;
    } else {
      // Se non trovato, fai una richiesta al server per recuperarlo
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include", // Include i cookie nella richiesta
        });

        if (response.ok) {
          const data = await response.json();
          this.accountName = data.user.nome || "Utente"; // Imposta il nome dell'utente
          // Salva il nome utente nel sessionStorage per evitare richieste future
          sessionStorage.setItem("accountName", this.accountName);
        } else {
          console.error("Errore nel recupero del profilo:", response.status);
          this.$router.push("/"); // Reindirizza alla login se non autenticato
        }
      } catch (error) {
        console.error("Errore nella richiesta del profilo:", error.message);
        this.$router.push("/"); // Reindirizza alla login in caso di errore
      }
    }
  },
  methods: {
    navigateHome() {
      this.$router.push("/");
    },
    async logout() {
      try {
        const response = await fetch("http://localhost:3000/logout", {
          method: "POST",
          credentials: "include", // Include i cookie nella richiesta
        });

        if (response.ok) {
          sessionStorage.clear(); // Rimuovi i dati dalla sessione
          localStorage.removeItem("user-token"); // Rimuovi il token dal localStorage
          sessionStorage.removeItem("accountName"); // Rimuovi il nome utente dalla sessione
          this.$router.push("/"); // Reindirizza alla pagina di login
        } else {
          console.error("Errore durante il logout:", response.status);
        }
      } catch (error) {
        console.error("Errore nella richiesta di logout:", error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Stili principali */
.container {
  max-width: 400px;
  width: 90%; 
  margin: auto;
  padding: 30px 20px;
  background-color: #4CAF50; 
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  color: white;
  font-family: Arial, sans-serif;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #fff;
}

.navbar-left span {
  font-size: 1rem;
  font-weight: bold;
}

.logout-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #e53935;
}

/* Contenuto */
.content h1 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: bold;
}

.content p {
  font-size: 1rem;
  margin-bottom: 25px;
}

/* Pulsante Home */
.home-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #ffffff;
  color: #4CAF50;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.home-button:hover {
  background-color: #f0f0f0;
  color: #388E3C;
}

/* Media queries */
@media (max-width: 480px) {
  .container {
    padding: 20px 15px;
  }

  .navbar-left span {
    font-size: 0.9rem;
  }

  .logout-button {
    font-size: 0.8rem;
  }
}

@media (min-width: 768px) {
  .container {
    padding: 40px 30px;
    max-width: 450px;
  }

  .content h1 {
    font-size: 2rem;
  }

  .content p {
    font-size: 1.1rem;
  }

  .home-button {
    font-size: 1.1rem;
    padding: 12px 25px;
  }
}
</style>