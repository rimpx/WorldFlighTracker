class MockDB {
    constructor() {
        // Inizializza la "tabella" users come un array in memoria
        this.users = [
            // Admin Users
            { id: 1, username: 'admin', email: 'admin@worldflighttracker.com', password: 'admin123', is_admin: true, favorite_airport: 'LAX' },
            { id: 2, username: 'superadmin', email: 'superadmin@example.com', password: 'superadmin123', is_admin: true, favorite_airport: 'JFK' },
            { id: 3, username: 'admin2', email: 'admin2@example.com', password: 'adminpass2', is_admin: true, favorite_airport: 'ORD' },
            { id: 4, username: 'admin_team', email: 'adminteam@example.com', password: 'teamadmin123', is_admin: true, favorite_airport: 'ATL' },

            // Normal Users
            { id: 5, username: 'user1', email: 'user1@example.com', password: 'user123', is_admin: false, favorite_airport: 'DFW' },
            { id: 6, username: 'user2', email: 'user2@example.com', password: 'user123', is_admin: false, favorite_airport: 'DEN' },
            { id: 7, username: 'user3', email: 'user3@example.com', password: 'user123', is_admin: false, favorite_airport: 'SFO' },
            { id: 8, username: 'user4', email: 'user4@example.com', password: 'user123', is_admin: false, favorite_airport: 'SEA' },
            { id: 9, username: 'user5', email: 'user5@example.com', password: 'user123', is_admin: false, favorite_airport: 'LAS' },
            { id: 10, username: 'user6', email: 'user6@example.com', password: 'user123', is_admin: false, favorite_airport: 'MIA' },
            { id: 11, username: 'user7', email: 'user7@example.com', password: 'user123', is_admin: false, favorite_airport: 'PHX' },
            { id: 12, username: 'user8', email: 'user8@example.com', password: 'user123', is_admin: false, favorite_airport: 'IAH' },
            { id: 13, username: 'user9', email: 'user9@example.com', password: 'user123', is_admin: false, favorite_airport: 'BOS' },
            { id: 14, username: 'user10', email: 'user10@example.com', password: 'user123', is_admin: false, favorite_airport: 'MSP' },
            { id: 15, username: 'user11', email: 'user11@example.com', password: 'user123', is_admin: false, favorite_airport: 'CLT' },
            { id: 16, username: 'user12', email: 'user12@example.com', password: 'user123', is_admin: false, favorite_airport: 'FLL' },
            { id: 17, username: 'user13', email: 'user13@example.com', password: 'user123', is_admin: false, favorite_airport: 'DTW' },
            { id: 18, username: 'user14', email: 'user14@example.com', password: 'user123', is_admin: false, favorite_airport: 'PHL' },
            { id: 19, username: 'user15', email: 'user15@example.com', password: 'user123', is_admin: false, favorite_airport: 'LGA' },
            { id: 20, username: 'user16', email: 'user16@example.com', password: 'user123', is_admin: false, favorite_airport: 'SLC' },
            { id: 21, username: 'user17', email: 'user17@example.com', password: 'user123', is_admin: false, favorite_airport: 'DCA' },
            { id: 22, username: 'user18', email: 'user18@example.com', password: 'user123', is_admin: false, favorite_airport: 'SAN' },
            { id: 23, username: 'user19', email: 'user19@example.com', password: 'user123', is_admin: false, favorite_airport: 'MDW' },
            { id: 24, username: 'user20', email: 'user20@example.com', password: 'user123', is_admin: false, favorite_airport: 'TPA' },
            { id: 25, username: 'user21', email: 'user21@example.com', password: 'user123', is_admin: false, favorite_airport: 'HNL' },
            { id: 26, username: 'user22', email: 'user22@example.com', password: 'user123', is_admin: false, favorite_airport: 'BWI' },
            { id: 27, username: 'user23', email: 'user23@example.com', password: 'user123', is_admin: false, favorite_airport: 'MEM' },
            { id: 28, username: 'user24', email: 'user24@example.com', password: 'user123', is_admin: false, favorite_airport: 'RDU' },
            { id: 29, username: 'user25', email: 'user25@example.com', password: 'user123', is_admin: false, favorite_airport: 'CLE' },
            { id: 30, username: 'user26', email: 'user26@example.com', password: 'user123', is_admin: false, favorite_airport: 'PIT' },
        ];
        this.nextId = this.users.length + 1; // ID progressivo per nuovi utenti
    }

    // Ottieni tutti gli utenti
    getAllUsers() {
        return this.users.map(user => ({ ...user, password: undefined })); // Escludi la password per sicurezza
    }

    // Ottieni un utente per email
    getUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    // Crea un nuovo utente
    createUser({ username, email, password, is_admin = false }) {
        if (!username || !email || !password) {
            throw new Error('Tutti i campi sono obbligatori: username, email, password');
        }
        const newUser = { id: this.nextId++, username, email, password, is_admin };
        this.users.push(newUser);
        return newUser;
    }

    // Elimina un utente per ID
    deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) return false;
        this.users.splice(userIndex, 1);
        return true;
    }
}

export default MockDB;