import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

// Configurazione del database
const db = await open({
  filename: './database.db',
  driver: sqlite3.Database,
});

// Dati dell'utente admin
const adminUser = {
  username: 'admin',
  email: 'user@admin.it',
  password: 'admin', // Password in chiaro
  age: 30,
  favorite_airport: 'N/A',
  is_admin: 1, // Imposta l'utente come admin
};

// Hash della password
const hashedPassword = await bcrypt.hash(adminUser.password, 10);

// Inserisci l'utente nel database
try {
  const result = await db.run(
    `INSERT INTO users (username, email, password, age, favorite_airport, is_admin) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      adminUser.username,
      adminUser.email,
      hashedPassword,
      adminUser.age,
      adminUser.favorite_airport,
      adminUser.is_admin,
    ]
  );
  console.log(`Utente admin creato con ID: ${result.lastID}`);
} catch (err) {
  console.error('Errore durante l\'inserimento dell\'utente:', err.message);
} finally {
  // Chiudi la connessione al database
  await db.close();
  console.log('Connessione al database chiusa.');
}