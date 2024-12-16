class MockDB {
    constructor() {
        // Inizializza la "tabella" users come un array in memoria
        this.users = [
            { id: 1, username: 'admin', email: 'admin@worldflighttracker.com', password: 'admin123', is_admin: true },
            { id: 2, username: 'user1', email: 'user1@example.com', password: 'user123', is_admin: false },
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

module.exports = MockDB;