<template>
    <div class="container">
        <!-- Header -->
        <div class="admin-header">
            <h1 class="title">PANNELLO AMMINISTRAZIONE</h1>
            <div class="header-controls">
                <div class="visitor-counter">
                    Visitatori online: {{ visitorCount }}
                </div>
                <button @click="logout" class="logout-button">LOGOUT</button>
            </div>
        </div>

        <div class="admin-content">
            <h2 class="section-title">Gestione Utenti</h2>

            <!-- Filtro Aeroporto -->
            <div class="filter-section">
                <div class="filter-controls">
                    <input v-model="filterAirport" placeholder="Filtra per aeroporto (es. FCO)" class="filter-input" />
                    <div class="button-group">
                        <button @click="fetchFilteredUsers" class="filter-button">
                            <i class="fas fa-filter"></i> Applica Filtro
                        </button>
                        <button @click="fetchUsers" class="reset-button">
                            <i class="fas fa-sync"></i> Mostra Tutti
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tabella Utenti -->
            <div class="table-container">
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Età</th>
                            <th>Aeroporto</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td data-label="ID">{{ user.id }}</td>
                            <td data-label="Username">{{ user.username }}</td>
                            <td data-label="Email">{{ user.email }}</td>
                            <td data-label="Età">{{ user.age }}</td>
                            <td data-label="Aeroporto">{{ user.favorite_airport }}</td>
                            <td data-label="Azioni">
                                <button @click="deleteUser(user.id)" class="delete-button">
                                    <i class="fas fa-trash"></i> Elimina
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Messaggi di stato -->
            <div v-if="message" class="status-message">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';

export default {
    name: "AdminPage",
    data() {
        return {
            users: [],
            filterAirport: "",
            message: "",
            visitorCount: 0, // Contatore visitatori
            socket: null, // Istanza Socket.io
        };
    },
    async mounted() {
        await this.fetchUsers();

        // Connessione al server WebSocket
        this.socket = io('http://localhost:3000', {
            withCredentials: true,
        });

        // Ascolta gli aggiornamenti del contatore visitatori
        this.socket.on('admin_visitor_count', (count) => {
            this.visitorCount = count;
        });
    },
    beforeUnmount() {
        // Chiudi la connessione WebSocket quando il componente viene smontato
        if (this.socket) {
            this.socket.disconnect();
        }
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await fetch("http://localhost:3000/admin/users", { credentials: "include" });
                if (!response.ok) throw new Error(await response.text());
                this.users = await response.json();
            } catch (error) {
                this.message = "Errore nel caricamento degli utenti.";
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
.container {
    min-height: 100vh;
    background-color: #1a1a1a;
    color: white;
    font-family: 'Arial', sans-serif;
    padding: 20px;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #2c3e50, #3498db);
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 20px;
}

.visitor-counter {
    padding: 10px 15px;
    background-color: #4CAF50;
    border-radius: 6px;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.title {
    margin: 0;
    font-size: 1.8rem;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.section-title {
    color: #3498db;
    margin-bottom: 25px;
    font-size: 1.5rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
}

.filter-section {
    margin-bottom: 30px;
}

.filter-controls {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.filter-input {
    padding: 12px;
    border: 2px solid #3498db;
    border-radius: 6px;
    background-color: #2c2c2c;
    color: white;
    font-size: 1rem;
    flex: 1;
}

.button-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

button {
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
}

.filter-button {
    background-color: #3498db;
    color: white;
}

.filter-button:hover {
    background-color: #2980b9;
    transform: translateY(-1px);
}

.reset-button {
    background-color: #95a5a6;
    color: white;
}

.reset-button:hover {
    background-color: #7f8c8d;
}

.delete-button {
    background-color: #e74c3c;
    padding: 8px 12px;
}

.delete-button:hover {
    background-color: #c0392b;
}

.table-container {
    overflow-x: auto;
    background-color: #2c2c2c;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.users-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
}

.users-table th,
.users-table td {
    padding: 12px 15px;
    text-align: left;
}

.users-table th {
    background-color: #3498db;
    color: white;
    font-weight: 600;
}

.users-table tr:nth-child(even) {
    background-color: #333;
}

.users-table tr:hover {
    background-color: #3d3d3d;
}

.status-message {
    margin-top: 20px;
    padding: 15px;
    border-radius: 6px;
    background-color: #34495e;
    color: white;
}

.logout-button {
    background-color: #e74c3c;
    padding: 12px 25px;
    font-weight: bold;
}

.logout-button:hover {
    background-color: #c0392b;
    transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
    .admin-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }

    .header-controls {
        flex-direction: column;
        gap: 10px;
    }

    .title {
        font-size: 1.5rem;
    }

    .button-group {
        flex-direction: column;
        width: 100%;
    }

    button {
        width: 100%;
        justify-content: center;
    }

    .users-table {
        font-size: 0.9rem;
    }

    .users-table th,
    .users-table td {
        padding: 10px;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 10px;
    }

    .users-table {
        min-width: 100%;
    }

    .users-table tr {
        display: block;
        margin-bottom: 15px;
    }

    .users-table td {
        display: block;
        text-align: right;
        position: relative;
        padding-left: 50%;
    }

    .users-table td::before {
        content: attr(data-label);
        position: absolute;
        left: 0;
        width: 45%;
        padding-left: 15px;
        font-weight: bold;
        text-align: left;
        color: #3498db;
    }

    .users-table thead {
        display: none;
    }
}
</style>