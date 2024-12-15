<template>
  <nav class="navbar">
    <div class="navbar-left">
      <a href="/success" class="home-link">WORLDFLIGHTRACKER</a>
      <span>Ciao, {{ accountName }}    Aeroporto Preferito: {{ favoriteAirport }}</span>
    </div>
    <div class="navbar-right">
      <button @click="$router.push('/account')" class="account-button">ACCOUNT</button>
      <button @click="logout" class="logout-button">LOGOUT</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppNavbar", // Nome multi-word
  props: ["accountName", "favoriteAirport"],
  methods: {
    async logout() {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        sessionStorage.clear();
        localStorage.removeItem("user-token");
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
/* Stili della navbar */
.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px 5%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.navbar-left a {
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
}

.navbar-left span {
  font-size: 1rem;
  color: #555;
}

.account-button,
.logout-button {
  padding: 8px 12px;
  font-size: 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.account-button {
  background-color: #007BFF;
  color: white;
}

.account-button:hover {
  background-color: #0056b3;
}

.logout-button {
  background-color: #ff4d4f;
  color: white;
}

.logout-button:hover {
  background-color: #e53935;
}
</style>