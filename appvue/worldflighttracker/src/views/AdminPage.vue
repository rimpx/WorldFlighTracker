<template>
    <div class="container">
        <!-- Header -->
        <div class="admin-header">
            <div class="header-content">
                <div class="title-section">
                    <div class="logo-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" class="admin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <h1 class="title">PANNELLO AMMINISTRAZIONE</h1>
                </div>
                <div class="header-controls">
                    <div class="admin-badge">
                        <span class="admin-info">Admin: {{ getCurrentTime() }}</span>
                    </div>
                    <button @click="logout" class="logout-button">
                        <svg xmlns="http://www.w3.org/2000/svg" class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>LOGOUT</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="admin-content">
            <!-- Sezione Creazione Admin -->
            <div class="admin-section card-effect">
                <div class="section-header">
                    <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    <h2 class="section-title">Crea Nuovo Admin</h2>
                </div>
                <div class="admin-form">
                    <div class="form-group">
                        <label for="adminUsername">Username</label>
                        <div class="input-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <input id="adminUsername" v-model="newAdmin.username" placeholder="Username" class="admin-input" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="adminEmail">Email</label>
                        <div class="input-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input id="adminEmail" v-model="newAdmin.email" type="email" placeholder="Email" class="admin-input" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="adminPassword">Password</label>
                        <div class="input-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input id="adminPassword" v-model="newAdmin.password" type="password" placeholder="Password" class="admin-input" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="adminAge">Età (minimo 18 anni)</label>
                        <div class="input-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <input id="adminAge" v-model="newAdmin.age" type="number" min="18" placeholder="Età" class="admin-input" required />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="adminAirport">Aeroporto Preferito</label>
                        <div class="input-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <input id="adminAirport" v-model="newAdmin.favorite_airport" placeholder="Aeroporto (es. FCO)" class="admin-input" />
                        </div>
                    </div>
                    <button @click="createAdmin" class="create-button">
                        <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        <span>Crea Admin</span>
                    </button>
                </div>
            </div>

            <div class="section-header user-management-header">
                <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h2 class="section-title">Gestione Utenti</h2>
            </div>

            <!-- Filtro Avanzato -->
            <div class="filter-section card-effect">
                <div class="filter-header">
                    <svg xmlns="http://www.w3.org/2000/svg" class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    <h3 class="filter-title">Filtra Utenti</h3>
                </div>
                <div class="filter-tabs">
                    <button 
                        @click="activeFilter = 'airport'"
                        :class="['filter-tab', { 'active': activeFilter === 'airport' }]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>Filtra per Aeroporto</span>
                    </button>
                    <button 
                        @click="activeFilter = 'email'"
                        :class="['filter-tab', { 'active': activeFilter === 'email' }]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>Filtra per Email</span>
                    </button>
                </div>
                
                <div class="filter-controls">
                    <div v-if="activeFilter === 'airport'" class="input-wrapper filter-input-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <input 
                            v-model="filterAirport" 
                            placeholder="Inserisci codice aeroporto (es. FCO)" 
                            class="filter-input" 
                        />
                    </div>
                    <div v-if="activeFilter === 'email'" class="input-wrapper filter-input-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <input 
                            v-model="filterEmail" 
                            placeholder="Inserisci email da cercare" 
                            class="filter-input" 
                        />
                    </div>
                    
                    <div class="button-group">
                        <button @click="applyFilter" class="filter-button">
                            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                            </svg>
                            <span>Applica Filtro</span>
                        </button>
                        <button @click="fetchUsers" class="reset-button">
                            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                            </svg>
                            <span>Mostra Tutti</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tabella Utenti -->
            <div class="table-container card-effect">
                <div class="table-header">
                    <svg xmlns="http://www.w3.org/2000/svg" class="table-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <h3 class="table-title">Lista Utenti</h3>
                </div>
                <div class="table-scroll">
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
                            <tr v-for="user in users" :key="user.id" class="user-row">
                                <td data-label="ID" class="user-id">{{ user.id }}</td>
                                <td data-label="Username" class="user-name">{{ user.username }}</td>
                                <td data-label="Email" class="user-email">{{ user.email }}</td>
                                <td data-label="Età" class="user-age">{{ user.age }}</td>
                                <td data-label="Aeroporto" class="user-airport">
                                    <span class="airport-badge">{{ user.favorite_airport || 'N/A' }}</span>
                                </td>
                                <td data-label="Ruolo" class="user-role">
                                    <span :class="['role-badge', user.is_admin ? 'admin-badge' : 'user-badge']">
                                        {{ user.is_admin ? 'Admin' : 'Utente' }}
                                    </span>
                                </td>
                                <td data-label="Azioni" class="user-actions">
                                    <button @click="deleteUser(user.id)" class="delete-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                        </svg>
                                        <span>Elimina</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Messaggi di stato -->
            <div v-if="message" class="status-message" :class="{ 'success': !isError, 'error': isError }">
                <div class="message-icon">
                    <svg v-if="!isError" xmlns="http://www.w3.org/2000/svg" class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                </div>
                <span class="message-text">{{ message }}</span>
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
        },
        getCurrentTime() {
            return "rimpx";
        }
    },
};
</script>

<style scoped>
/* Animazioni */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Layout di base */
.container {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: white;
    font-family: 'Segoe UI', Arial, sans-serif;
    padding: 20px;
    overflow-x: hidden;
}

.admin-content {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px 0;
    animation: fadeIn 0.5s ease-out;
}

/* Effetto carta per i componenti */
.card-effect {
    background: linear-gradient(145deg, #1e293b, #0f172a);
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    overflow: hidden;
}

.card-effect:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    transform: translateY(-5px);
}

/* Header Amministrazione */
.admin-header {
    background: linear-gradient(135deg, #1e40af, #3b82f6);
    margin-bottom: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    padding: 0;
    overflow: hidden;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
}

.title-section {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    width: 45px;
    height: 45px;
    border-radius: 12px;
}

.admin-icon {
    width: 24px;
    height: 24px;
    stroke: white;
}

.title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    letter-spacing: 1px;
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 20px;
}

.admin-badge {
    background: rgba(255, 255, 255, 0.15);
    padding: 8px 15px;
    border-radius: 20px;
}

.admin-info {
    font-size: 0.9rem;
    font-weight: 500;
}

.logout-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.2);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logout-button:hover {
    background: rgba(220, 38, 38, 0.8);
    transform: translateY(-2px);
}

.logout-icon {
    width: 18px;
    height: 18px;
    stroke: white;
}

/* Titoli delle sezioni */
.section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.user-management-header {
    margin-top: 40px;
    margin-bottom: 20px;
}

.section-icon {
    width: 24px;
    height: 24px;
    stroke: #3b82f6;
}

.section-title {
    color: white;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-bottom: none;
    padding-bottom: 0;
}

/* Sezione Admin */
.admin-section {
    margin-bottom: 40px;
    padding: 25px;
}

.admin-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 12px;
    width: 18px;
    height: 18px;
    stroke: #3b82f6;
}

.admin-input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.admin-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    background: rgba(255, 255, 255, 0.1);
}

.admin-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.create-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #10b981, #059669);
    padding: 14px;
    margin-top: 10px;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.create-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-icon {
    width: 18px;
    height: 18px;
    stroke: white;
}

/* Sezione Filtri */
.filter-section {
    margin-bottom: 30px;
    padding: 25px;
}

.filter-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.filter-icon {
    width: 20px;
    height: 20px;
    stroke: #3b82f6;
}

.filter-title {
    margin: 0;
    color: white;
    font-size: 1.2rem;
    font-weight: 500;
}

.filter-tabs {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 15px;
}

.filter-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 0.95rem;
}

.filter-tab:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.filter-tab.active {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border-color: #3b82f6;
}

.tab-icon {
    width: 16px;
    height: 16px;
    stroke: currentColor;
}

.filter-controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.filter-input-wrapper {
    width: 100%;
}

.filter-input {
    width: 100%;
    padding: 14px 14px 14px 40px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.filter-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    background: rgba(255, 255, 255, 0.1);
}

.filter-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.button-group {
    display: flex;
    gap: 15px;
}

.filter-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border: none;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.filter-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.reset-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.reset-button:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
}

/* Tabella utenti */
.table-container {
    margin-bottom: 30px;
    overflow: hidden;
}

.table-header {
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #1e293b, #0f172a);
    padding: 20px 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-icon {
    width: 20px;
    height: 20px;
    stroke: #3b82f6;
}

.table-title {
    margin: 0;
    color: white;
    font-size: 1.2rem;
    font-weight: 500;
}

.table-scroll {
    overflow-x: auto;
    padding: 10px;
}

.users-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 800px;
}

.users-table th {
    text-align: left;
    padding: 15px 20px;
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 10;
}

.users-table th:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}

.users-table th:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
}

.user-row {
    transition: all 0.3s ease;
}

.user-row:hover {
    background: rgba(255, 255, 255, 0.05);
}

.users-table td {
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
}

.user-id {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    width: 60px;
}

.user-name {
    font-weight: 600;
}

.user-email {
    color: rgba(255, 255, 255, 0.7);
}

.airport-badge {
    display: inline-block;
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: uppercase;
}

.role-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

.admin-badge {
    background-color: rgba(220, 38, 38, 0.1);
    color: #ef4444;
}

.user-badge {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
}

.delete-button {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(220, 38, 38, 0.1);
    color: #ef4444;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.delete-button:hover {
    background: rgba(220, 38, 38, 0.2);
    transform: translateY(-2px);
}

.delete-icon {
    width: 16px;
    height: 16px;
    stroke: currentColor;
}

/* Messaggi di stato */
.status-message {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    animation: slideInRight 0.4s ease-out;
}

.status-message.success {
    background: rgba(16, 185, 129, 0.1);
    border-left: 4px solid #10b981;
}

.status-message.error {
    background: rgba(239, 68, 68, 0.1);
    border-left: 4px solid #ef4444;
}

.message-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.success-icon {
    width: 20px;
    height: 20px;
    stroke: #10b981;
}

.error-icon {
    width: 20px;
    height: 20px;
    stroke: #ef4444;
}

.message-text {
    font-size: 0.95rem;
    font-weight: 500;
}

.success .message-text {
    color: #10b981;
}

.error .message-text {
    color: #ef4444;
}

/* Design responsive */
@media (max-width: 1024px) {
    .admin-content {
        padding: 15px;
    }
    
    .admin-form {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 15px;
        padding: 15px;
    }
    
    .header-controls {
        width: 100%;
        justify-content: space-between;
    }
    
    .admin-form {
        grid-template-columns: 1fr;
    }
    
    .button-group {
        flex-direction: column;
    }
    
    .filter-tabs {
        flex-direction: column;
        gap: 10px;
    }
    
    .title {
        font-size: 1.3rem;
    }
    
    .section-title {
        font-size: 1.3rem;
    }
}

@media (max-width: 576px) {
    .container {
        padding: 10px;
    }
    
    .title-section {
        width: 100%;
        justify-content: center;
    }
    
    .logo-badge {
        width: 38px;
        height: 38px;
    }
    
    .admin-icon {
        width: 20px;
        height: 20px;
    }
    
    .title {
        font-size: 1.1rem;
    }
    
    .admin-badge {
        padding: 6px 10px;
        font-size: 0.8rem;
    }
    
    .logout-button {
        padding: 8px 12px;
        font-size: 0.9rem;
    }
    
    .logout-button span {
        display: none;
    }
    
    .section-title {
        font-size: 1.1rem;
    }
    
    .users-table {
        min-width: auto;
        display: block;
        width: 100%;
    }
    
    .users-table thead {
        display: none;
    }
    
    .users-table tbody,
    .users-table tr {
        display: block;
        width: 100%;
    }
    
    .users-table tr {
        margin-bottom: 15px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        overflow: hidden;
    }
    
    .users-table td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        text-align: right;
        padding: 10px 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
    
    .users-table td::before {
        content: attr(data-label);
        text-align: left;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .delete-button {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .header-controls {
        flex-direction: column;
        gap: 10px;
    }
    
    .admin-badge, 
    .logout-button {
        width: 100%;
        justify-content: center;
    }
    
    .logout-button span {
        display: inline;
    }
}

@media (max-width: 360px) {
    .title {
        font-size: 1rem;
    }
    
    .admin-icon,
    .section-icon {
        width: 18px;
        height: 18px;
    }
}
</style>