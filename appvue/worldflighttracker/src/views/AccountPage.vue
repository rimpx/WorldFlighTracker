<template>
    <div class="container">
        <!-- Navbar riutilizzabile -->
        <Navbar :accountName="user.username" :favoriteAirport="user.favorite_airport" />

        <!-- Contenuto principale -->
        <div class="account-container">
            <!-- Informazioni utente -->
            <div class="info-section">
                <h2>Informazioni Account</h2>
                <ul>
                    <li><strong>Username:</strong> {{ user.username }}</li>
                    <li><strong>Email:</strong> {{ user.email }}</li>
                    <li><strong>Età:</strong> {{ user.age }}</li>
                    <li><strong>Aeroporto Preferito:</strong> {{ user.favorite_airport }}</li>
                </ul>
                <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
            </div>

            <!-- Modifica informazioni -->
            <div class="edit-section">
                <h2>Modifica Informazioni</h2>
                <div class="form-group">
                    <label for="airport">Nuovo Aeroporto Preferito</label>
                    <input v-model="updatedAirport" id="airport" placeholder="Nuovo aeroporto" />
                    <button @click="updateAirport" class="update-button">Aggiorna Aeroporto</button>
                </div>
                <div class="form-group">
                    <label for="password">Nuova Password</label>
                    <input type="password" v-model="newPassword" id="password" placeholder="Nuova password" />
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Conferma Password</label>
                    <input type="password" v-model="confirmPassword" id="confirmPassword"
                        placeholder="Conferma password" />
                    <button @click="updatePassword" class="update-button">Cambia Password</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from "@/components/AppNavbar.vue";
import { fetchUserData, useAuth } from "@/composables/useAuth";

export default {
    name: "AccountPage",
    components: { Navbar },
    data() {
        return {
            updatedAirport: "",
            newPassword: "",
            confirmPassword: "",
            successMessage: "",
        };
    },
    async mounted() {
        await fetchUserData();
        this.updatedAirport = this.user.favorite_airport;
    },
    computed: {
        user() {
            return useAuth().user.value; // Ottieni i dati utente
        },
    },
    methods: {
        async updateAirport() {
            try {
                const response = await fetch("http://localhost:3000/update-airport", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ airport: this.updatedAirport }),
                });

                if (response.ok) {
                    this.successMessage = "Aeroporto aggiornato con successo!";
                    await fetchUserData();
                } else {
                    alert("Errore nell'aggiornamento dell'aeroporto.");
                }
            } catch (error) {
                console.error("Errore aggiornamento aeroporto:", error.message);
            }
        },
        async updatePassword() {
            if (this.newPassword !== this.confirmPassword) {
                alert("Le password non coincidono!");
                return;
            }
            try {
                const response = await fetch("http://localhost:3000/update-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ password: this.newPassword }),
                });

                if (response.ok) {
                    this.successMessage = "Password aggiornata con successo!";
                    this.newPassword = "";
                    this.confirmPassword = "";
                } else {
                    alert("Errore nell'aggiornamento della password.");
                }
            } catch (error) {
                console.error("Errore aggiornamento password:", error.message);
            }
        },
    },
};
</script>

<style scoped>
/* Stili principali */
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #000;
    color: white;
}

.account-container {
    display: flex;
    gap: 20px;
    padding: 20px 5%;
    flex: 1;
}

.info-section,
.edit-section {
    background-color: #333;
    border-radius: 12px;
    padding: 20px;
    flex: 1;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
}

.success-message {
    color: #4CAF50;
    margin-top: 10px;
}

.form-group {
    margin: 15px 0;
}

input {
    display: block;
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border-radius: 5px;
    border: none;
}

.update-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.update-button:hover {
    background-color: #388E3C;
}
</style>