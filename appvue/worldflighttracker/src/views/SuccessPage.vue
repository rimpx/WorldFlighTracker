template>
  <div class="container">
    <h1>Login avvenuto con successo!</h1>
    <p>Benvenuto! Hai effettuato l'accesso con successo.</p>
    <button @click="navigateHome" class="home-button">Vai alla Home</button>
  </div>
</template>

<script>
export default {
  name: "SuccessPage",
  methods: {
    navigateHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
/* Stili principali per la container */
.container {
  max-width: 400px;
  width: 90%; /* Assicura che sia ben visibile su schermi stretti */
  margin: auto;
  padding: 30px 20px;
  background-color: #4CAF50; /* Colore di successo verde */
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  color: white;
  font-family: Arial, sans-serif;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Effetto al passaggio del mouse */
.container:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

h1 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: bold;
}

p {
  font-size: 1rem;
  margin-bottom: 25px;
}

/* Stile del pulsante "Home" */
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

/* Layout per schermi piccoli (smartphone) */
@media (max-width: 480px) {
  .container {
    padding: 20px 15px;
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 0.9rem;
  }

  .home-button {
    font-size: 0.9rem;
    padding: 8px 15px;
  }
}

/* Layout per schermi grandi (desktop) */
@media (min-width: 768px) {
  .container {
    padding: 40px 30px;
    max-width: 450px;
  }

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1.1rem;
  }

   .home-button {
    font-size: 1.1rem;
    padding: 12px 25px;
  }
}
</style>