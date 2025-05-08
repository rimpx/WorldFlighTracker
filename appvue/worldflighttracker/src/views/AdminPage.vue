<template>
    <div class="container">
        <!-- Header -->
        <div class="admin-header">
            <h1 class="title">PANNELLO AMMINISTRAZIONE</h1>
            <div class="header-controls">
                <button @click="logout" class="logout-button">LOGOUT</button>
            </div>
        </div>

        <div class="admin-content">
            <!-- Sezione Creazione Admin -->
            <div class="admin-section">
                <h2 class="section-title">Crea Nuovo Admin</h2>
                <div class="admin-form">
                    <div class="form-group">
                        <label for="adminUsername">Username</label>
                        <input id="adminUsername" v-model="newAdmin.username" placeholder="Username" class="admin-input" required />
                    </div>
                    <div class="form-group">
                        <label for="adminEmail">Email</label>
                        <input id="adminEmail" v-model="newAdmin.email" type="email" placeholder="Email" class="admin-input" required />
                    </div>
                    <div class="form-group">
                        <label for="adminPassword">Password</label>
                        <input id="adminPassword" v-model="newAdmin.password" type="password" placeholder="Password" class="admin-input" required />
                    </div>
                    <div class="form-group">
                        <label for="adminAge">Età (minimo 18 anni)</label>
                        <input id="adminAge" v-model="newAdmin.age" type="number" min="18" placeholder="Età" class="admin-input" required />
                    </div>
                    <div class="form-group">
                        <label for="adminAirport">Aeroporto Preferito</label>
                        <input id="adminAirport" v-model="newAdmin.favorite_airport" placeholder="Aeroporto (es. FCO)" class="admin-input" />
                    </div>
                    <button @click="createAdmin" class="create-button">
                        <i class="fas fa-user-plus"></i> Crea Admin
                    </button>
                </div>
            </div>

            <h2 class="section-title">Gestione Utenti</h2>

            <!-- Filtro Avanzato -->
            <div class="filter-section">
                <div class="filter-tabs">
                    <button 
                        @click="activeFilter = 'airport'"
                        :class="['filter-tab', { 'active': activeFilter === 'airport' }]"
                    >
                        <i class="fas fa-plane"></i> Filtra per Aeroporto
                    </button>
                    <button 
                        @click="activeFilter = 'email'"
                        :class="['filter-tab', { 'active': activeFilter === 'email' }]"
                    >
                        <i class="fas fa-envelope"></i> Filtra per Email
                    </button>
                </div>
                
                <div class="filter-controls">
                    <input 
                        v-if="activeFilter === 'airport'"
                        v-model="filterAirport" 
                        placeholder="Inserisci codice aeroporto (es. FCO)" 
                        class="filter-input" 
                    />
                    <input 
                        v-if="activeFilter === 'email'"
                        v-model="filterEmail" 
                        placeholder="Inserisci email da cercare" 
                        class="filter-input" 
                    />
                    
                    <div class="button-group">
                        <button @click="applyFilter" class="filter-button">
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
                            <th>Ruolo</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td data-label="ID">{{ user.id }}</td>
                            <td data-label="Username">{{ user.username }}</td>
                            <td data-label="Email">{{ user.email }}</td>
                            <td data-label="Età">{{ user.age }}</td>
                            <td data-label="Aeroporto">{{ user.favorite_airport || 'N/A' }}</td>
                            <td data-label="Ruolo">{{ user.is_admin ? 'Admin' : 'Utente' }}</td>
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
            <div v-if="message" class="status-message" :class="{ 'success': !isError, 'error': isError }">
                {{ message }}
            </div>
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
            filterEmail: "",
            activeFilter: "airport", // Filtro attivo di default
            message: "",
            isError: false,
            visitorCount: 0, // Contatore visitatori statico
            activeUsers: [], // Lista vuota di utenti attivi
            apiBaseUrl: "", // URL base per le API
            newAdmin: {
                username: "",
                email: "",
                password: "",
                age: "",
                favorite_airport: "",
            }
        };
    },
    async mounted() {
        // Configura l'URL dell'API
        this.configureApiBaseUrl();
        await this.fetchUsers();
    },
    methods: {
        configureApiBaseUrl() {
            // Strategia dinamica per determinare l'URL di base dell'API
            const isHttps = window.location.protocol === 'https:';
            
            if (window.location.host.includes('.app.github.dev') || isHttps) {
                const hostParts = window.location.host.split('-');
                if (hostParts.length > 1) {
                    const portIndex = hostParts.length - 1;
                    hostParts[portIndex] = '3000';
                    this.apiBaseUrl = `${window.location.protocol}//${hostParts.join('-')}.app.github.dev`;
                } else {
                    this.apiBaseUrl = `${window.location.protocol}//${window.location.hostname}:3000`;
                }
            } else {
                this.apiBaseUrl = 'http://localhost:3000';
            }
            
            console.log(`API Base URL configurato: ${this.apiBaseUrl}`);
        },

        async fetchUsers() {
            try {
                const response = await fetch(`${this.apiBaseUrl}/admin/users`, { credentials: "include" });
                if (!response.ok) throw new Error(await response.text());
                this.users = await response.json();
                this.clearFilters();
                this.message = "";
            } catch (error) {
                this.message = "Errore nel caricamento degli utenti.";
                this.isError = true;
            }
        },
        
        applyFilter() {
            if (this.activeFilter === 'airport') {
                this.fetchFilteredUsersByAirport();
            } else if (this.activeFilter === 'email') {
                this.fetchFilteredUsersByEmail();
            }
        },
        
        async fetchFilteredUsersByAirport() {
            if (!this.filterAirport.trim()) {
                this.message = "Inserisci un aeroporto valido per il filtro.";
                this.isError = true;
                return;
            }

            try {
                const response = await fetch(
                    `${this.apiBaseUrl}/admin/users/filter?airport=${encodeURIComponent(this.filterAirport)}`,
                    { credentials: "include" }
                );
                if (response.ok) {
                    this.users = await response.json();
                    this.message = this.users.length > 0 
                        ? `Trovati ${this.users.length} utenti per l'aeroporto ${this.filterAirport.toUpperCase()}` 
                        : `Nessun utente trovato per l'aeroporto ${this.filterAirport.toUpperCase()}`;
                    this.isError = false;
                } else {
                    const errorDetails = await response.json();
                    throw new Error(errorDetails.message || "Errore nel filtraggio utenti");
                }
            } catch (error) {
                console.error("Errore fetch utenti per aeroporto:", error.message);
                this.message = "Errore: " + error.message;
                this.isError = true;
            }
        },
        
        async fetchFilteredUsersByEmail() {
            if (!this.filterEmail.trim()) {
                this.message = "Inserisci un'email valida per il filtro.";
                this.isError = true;
                return;
            }

            try {
                const response = await fetch(
                    `${this.apiBaseUrl}/admin/users/filter/email?email=${encodeURIComponent(this.filterEmail)}`,
                    { credentials: "include" }
                );
                if (response.ok) {
                    this.users = await response.json();
                    this.message = this.users.length > 0 
                        ? `Trovati ${this.users.length} utenti con email contenente "${this.filterEmail}"` 
                        : `Nessun utente trovato con email contenente "${this.filterEmail}"`;
                    this.isError = false;
                } else {
                    const errorDetails = await response.json();
                    throw new Error(errorDetails.message || "Errore nel filtraggio utenti per email");
                }
            } catch (error) {
                console.error("Errore fetch utenti per email:", error.message);
                this.message = "Errore: " + error.message;
                this.isError = true;
            }
        },
        
        clearFilters() {
            this.filterAirport = "";
            this.filterEmail = "";
        },
        
        async deleteUser(userId) {
            if (!confirm("Sei sicuro di voler eliminare questo utente?")) return;

            try {
                const response = await fetch(`${this.apiBaseUrl}/admin/users/${userId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (response.ok) {
                    this.message = "Utente eliminato con successo!";
                    this.isError = false;
                    await this.fetchUsers(); // Aggiorna la lista utenti
                } else {
                    const errorDetails = await response.json();
                    throw new Error(errorDetails.message || "Errore nell'eliminazione utente");
                }
            } catch (error) {
                console.error("Errore deleteUser:", error.message);
                this.message = "Errore: " + error.message;
                this.isError = true;
            }
        },
        async createAdmin() {
            // Validazione base dei campi
            if (!this.newAdmin.username || !this.newAdmin.email || !this.newAdmin.password || !this.newAdmin.age) {
                this.message = "Tutti i campi obbligatori devono essere compilati";
                this.isError = true;
                return;
            }

            // Validazione specifica per l'età (minimo 18 anni)
            const age = parseInt(this.newAdmin.age);
            if (isNaN(age) || age < 18) {
                this.message = "L'età minima richiesta per un admin è 18 anni";
                this.isError = true;
                return;
            }

            try {
                const response = await fetch(`${this.apiBaseUrl}/admin/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        username: this.newAdmin.username,
                        email: this.newAdmin.email,
                        password: this.newAdmin.password,
                        age: parseInt(this.newAdmin.age), // Assicuriamoci che sia un numero
                        favorite_airport: this.newAdmin.favorite_airport
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    this.message = result.message || "Admin creato con successo!";
                    this.isError = false;
                    
                    // Reset del form
                    this.newAdmin = {
                        username: "",
                        email: "",
                        password: "",
                        age: "",
                        favorite_airport: ""
                    };
                    
                    // Aggiorna la lista utenti
                    await this.fetchUsers();
                } else {
                    const errorDetails = await response.json();
                    throw new Error(errorDetails.message || "Errore nella creazione dell'admin");
                }
            } catch (error) {
                console.error("Errore createAdmin:", error.message);
                this.message = "Errore: " + error.message;
                this.isError = true;
            }
        },
        logout() {
            fetch(`${this.apiBaseUrl}/logout`, {
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
                    this.isError = true;
                });
        }
    },
};
</script>

<style scoped>
/* Gli stili rimangono invariati */
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
    background-color: #2c2c2c;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.filter-tabs {
    display: flex;
    margin-bottom: 15px;
    border-bottom: 1px solid #444;
}

.filter-tab {
    background: none;
    border: none;
    color: #95a5a6;
    padding: 10px 20px;
    margin-right: 5px;
    cursor: pointer;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
}

.filter-tab:hover {
    color: white;
    background-color: rgba(52, 152, 219, 0.1);
}

.filter-tab.active {
    color: #3498db;
    border-bottom: 2px solid #3498db;
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
    background-color: #333;
    color: white;
    font-size: 1rem;
    flex: 1;
}

.filter-input:focus {
    outline: none;
    border-color: #2ecc71;
    box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
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
    margin-bottom: 30px;
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
    text-align: center;
}

.status-message.success {
    background-color: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
    border: 1px solid #4CAF50;
}

.status-message.error {
    background-color: rgba(231, 76, 60, 0.2);
    color: #e74c3c;
    border: 1px solid #e74c3c;
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

/* Stili per il form di creazione admin */
.admin-section {
    background-color: #2c2c2c;
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.admin-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.admin-input {
    padding: 12px;
    background-color: #333;
    border: 2px solid #3498db;
    border-radius: 6px;
    color: white;
    font-size: 1rem;
}

.admin-input:focus {
    outline: none;
    border-color: #2ecc71;
    box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
}

.create-button {
    background-color: #2ecc71;
    color: white;
    padding: 12px;
    margin-top: 20px;
    grid-column: 1 / -1;
    justify-content: center;
}

.create-button:hover {
    background-color: #27ae60;
    transform: translateY(-2px);
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

    .admin-form {
        grid-template-columns: 1fr;
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

    .filter-tabs {
        flex-direction: column;
        border-bottom: none;
    }

    .filter-tab {
        border-bottom: none;
        border-left: 2px solid transparent;
        margin-bottom: 5px;
    }

    .filter-tab.active {
        border-bottom: none;
        border-left: 2px solid #3498db;
        background-color: rgba(52, 152, 219, 0.1);
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