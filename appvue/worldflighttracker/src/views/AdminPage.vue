<template>
    <div class="container">
        <!-- Bottone Logout -->
        <div class="logout-container">
            <button @click="logout" class="logout-button">Logout</button>
        </div>

        <div class="admin-content">
            <h2>Gestione Utenti</h2>

            <!-- Filtro Aeroporto -->
            <div class="filter-section">
                <input v-model="filterAirport" placeholder="Filtra per aeroporto" />
                <button @click="fetchFilteredUsers">Filtra</button>
                <button @click="fetchUsers">Mostra Tutti</button>
            </div>

            <!-- Tabella Utenti -->
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Età</th>
                        <th>Aeroporto Preferito</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.age }}</td>
                        <td>{{ user.favorite_airport }}</td>
                        <td>
                            <button @click="deleteUser(user.id)" class="delete-button">Elimina</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="message">{{ message }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "AdminPage",
    data() {
        return {
            users: [],
            filterAirport: "",
            message: "",
        };
    },
    async mounted() {
        await this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await fetch("http://localhost:3000/admin/users", {
                    credentials: "include",
                });
                if (response.ok) {
                    this.users = await response.json();
                } else {
                    const errorDetails = await response.json();
                    throw new Error(errorDetails.message || "Errore nel recupero utenti");
                }
            } catch (error) {
                console.error("Errore fetchUsers:", error.message);
                this.message = "Errore: " + error.message;
            }
        },
        async fetchFilteredUsers() {
            if (!this.filterAirport.trim()) {
                this.message = "Inserisci un aeroporto valido per il filtro.";
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:3000/admin/users/filter?airport=${this.filterAirport}`,
                    { credentials: "include" }
                );
                if (response.ok) {
                    this.users = await response.json();
                } else {
                    const errorDetails = await response.json();
                    throw new Error(errorDetails.message || "Errore nel filtraggio utenti");
                }
            } catch (error) {
                console.error("Errore fetchFilteredUsers:", error.message);
                this.message = "Errore: " + error.message;
            }
        },
        async deleteUser(userId) {
            if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;

            try {
                const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (response.ok) {
                    this.message = "Utente eliminato con successo!";
                    await this.fetchUsers(); // Aggiorna la lista utenti
                } else {
                    const errorDetails = await response.json();
                    throw new Error(errorDetails.message || "Errore nell'eliminazione utente");
                }
            } catch (error) {
                console.error("Errore deleteUser:", error.message);
                this.message = "Errore: " + error.message;
            }
        },
        logout() {
            fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include",
            })
                .then(() => {
                    sessionStorage.clear();
                    localStorage.removeItem("user-token");
                    this.$router.push("/");
                })
                .catch((error) => {
                    console.error("Errore durante il logout:", error.message);
                    this.message = "Errore nel logout.";
                });
        },
    },
};
</script>

<style scoped>
.admin-content {
    padding: 20px;
    color: white;
}

.filter-section {
    margin-bottom: 20px;
}

input {
    padding: 8px;
    margin-right: 10px;
}

button {
    padding: 8px 12px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.delete-button {
    background-color: #FF4D4F;
}

.delete-button:hover {
    background-color: #E53935;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    color: white;
}

th {
    background-color: #444;
    color: white;
}

tbody tr:nth-child(even) {
    background-color: #333; /* Sfondo grigio scuro per righe pari */
    color: white;
}

tbody tr:nth-child(odd) {
    background-color: #444; /* Sfondo grigio leggermente più scuro per righe dispari */
    color: white;
}

.logout-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}

.logout-button {
    padding: 8px 12px;
    background-color: #E53935;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.logout-button:hover {
    background-color: #C62828;
}
</style>