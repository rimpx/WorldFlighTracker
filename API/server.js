const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:8080', 'https://www.rimpici.it'], // Permetti sia localhost che il dominio di produzione
    credentials: true,
  })
);

app.use(
  session({
    secret: 'il-tuo-segreto-unico',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 giorno
    },
  })
);

// Database setup
let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Errore durante la connessione al database:', err.message);
  } else {
    console.log('Connesso al database SQLite principale.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT,
    password TEXT NOT NULL,
    age INTEGER NOT NULL CHECK(age >= 16),
    favorite_airport TEXT NOT NULL
  )
`);

// Endpoint per la registrazione
app.post('/register', async (req, res) => {
  const { username, email, password, age, favorite_airport } = req.body;

  if (!username || !email || !password || !age || !favorite_airport) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  if (age < 16) {
    return res.status(400).json({ message: "L'età minima è di 16 anni" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.run(
      `INSERT INTO users (username, email, password, age, favorite_airport) VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, age, favorite_airport],
      function (err) {
        if (err) {
          console.error('Errore durante la registrazione:', err.message);
          return res.status(500).json({ message: 'Errore del server' });
        }
        res.status(201).json({ message: 'Utente registrato con successo', id: this.lastID });
      }
    );
  } catch (error) {
    console.error('Errore durante l\'hashing della password:', error.message);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Endpoint per il login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password sono obbligatori' });
  }

  db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err) {
        console.error('Errore durante il login:', err.message);
        return res.status(500).json({ message: 'Errore del server' });
      }

      if (!user) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenziali non valide' });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      res.json({ message: 'Login riuscito', user: req.session.user });
    }
  );
});

// Endpoint per il logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Errore durante il logout:', err.message);
      return res.status(500).json({ message: 'Errore del server' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout effettuato con successo' });
  });
});

// Endpoint di controllo sessione
app.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Gestione della chiusura del database
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Errore durante la chiusura del database:', err.message);
    }
    console.log('Connessione al database chiusa.');
    process.exit(0);
  });
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});