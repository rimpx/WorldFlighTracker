import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import session from 'express-session';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';
import MockDB from './mock.js';

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:8080', 'https://www.rimpici.it'], // Permetti localhost e produzione
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

const useMockDB = process.env.USE_MOCK_DB === 'true';
let db;

if (useMockDB) {
  console.log('Usando il Mock Database');
  db = new MockDB(); // Usa il mock database
} else {
  console.log('Usando SQLite Database');
  db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error('Errore durante la connessione al database:', err.message);
    else console.log('Connesso al database SQLite principale.');
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT,
      password TEXT NOT NULL,
      age INTEGER NOT NULL CHECK(age >= 16),
      favorite_airport TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT 0
    )
  `);
}

// Endpoint per la registrazione
app.post('/register', async (req, res) => {
  const { username, email, password, age, favorite_airport } = req.body;

  if (!username || !email || !password || !age || !favorite_airport) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (useMockDB) {
      db.createUser({ username, email, password: hashedPassword, is_admin: false });
      res.status(201).json({ message: 'Utente registrato con successo' });
    } else {
      db.run(
        `INSERT INTO users (username, email, password, age, favorite_airport, is_admin) VALUES (?, ?, ?, ?, ?, 0)`,
        [username, email, hashedPassword, age, favorite_airport],
        function (err) {
          if (err) {
            console.error('Errore durante la registrazione:', err.message);
            return res.status(500).json({ message: 'Errore del server' });
          }
          res.status(201).json({ message: 'Utente registrato con successo', id: this.lastID });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Middleware per proteggere gli endpoint admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.is_admin) {
    next();
  } else {
    return res.status(403).json({ message: "Accesso negato. Non sei un admin." });
  }
}

// Endpoint per il login
// Endpoint per il login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password sono obbligatori' });
  }

  let user;
  if (useMockDB) {
    user = db.getUserByEmail(email);
    if (user && user.password === password) { // Confronto diretto per il mock
      req.session.user = { id: user.id, username: user.username, is_admin: user.is_admin };
      return res.json({ message: 'Login riuscito', user: req.session.user });
    }
  } else {
    user = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = { id: user.id, username: user.username, is_admin: user.is_admin };
      return res.json({ message: 'Login riuscito', user: req.session.user });
    }
  }

  return res.status(401).json({ message: 'Credenziali non valide' });
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
  console.log('Verifica sessione:', req.session);

  if (!req.session.user || !req.session.user.id) {
    console.warn('Sessione non valida o utente non loggato');
    return res.status(401).json({ isAuthenticated: false, message: "Sessione non valida o utente non autenticato" });
  }

  if (useMockDB) {
    const user = db.getUserById(req.session.user.id);
    if (user) {
      res.json({ isAuthenticated: true, user });
    } else {
      res.status(404).json({ isAuthenticated: false, message: 'Utente non trovato nel mock DB' });
    }
  } else {
    db.get(
      `SELECT id, username, email, age, favorite_airport, is_admin FROM users WHERE id = ?`,
      [req.session.user.id],
      (err, user) => {
        if (err) {
          console.error('Errore SQL:', err.message);
          return res.status(500).json({ message: 'Errore del server durante il recupero utente.' });
        }

        if (!user) {
          console.warn(`Utente non trovato per ID ${req.session.user.id}`);
          return res.status(404).json({ isAuthenticated: false, message: 'Utente non trovato' });
        }

        console.log('Utente trovato:', user);
        res.json({ isAuthenticated: true, user });
      }
    );
  }
});

// Endpoint per ottenere tutti gli utenti (solo admin)
app.get('/admin/users', (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.status(403).json({ message: 'Accesso negato. Non sei un admin.' });
  }

  const users = useMockDB ? db.getAllUsers() : [];
  if (useMockDB) {
    res.json(users);
  } else {
    db.all(`SELECT id, username, email, age, favorite_airport FROM users`, (err, rows) => {
      if (err) return res.status(500).json({ message: 'Errore del server' });
      res.json(rows);
    });
  }
});

// Endpoint per filtrare gli utenti in base all'aeroporto (solo admin)
app.get('/admin/users/filter', isAdmin, (req, res) => {
  const { airport } = req.query;

  if (!airport) return res.status(400).json({ message: "Aeroporto mancante per il filtro." });

  if (useMockDB) {
    const filteredUsers = db.getAllUsers().filter(user => user.favorite_airport === airport);
    return res.json(filteredUsers);
  }

  db.all(
    `SELECT id, username, email, age, favorite_airport FROM users WHERE favorite_airport = ?`,
    [airport],
    (err, users) => {
      if (err) {
        console.error('Errore nel filtraggio utenti:', err.message);
        return res.status(500).json({ message: 'Errore del server' });
      }
      res.json(users);
    }
  );
});

// Endpoint per eliminare un utente (solo admin)
app.delete('/admin/users/:id', isAdmin, (req, res) => {
  const userId = req.params.id;

  db.run(`DELETE FROM users WHERE id = ?`, [userId], function (err) {
    if (err) {
      console.error('Errore nell\'eliminazione utente:', err.message);
      return res.status(500).json({ message: 'Errore del server' });
    }
    res.json({ message: 'Utente eliminato con successo' });
  });
});

// Endpoint per cercare un volo
const flightCache = {};


app.get('/api/flights/:flightCode', async (req, res) => {
  const { flightCode } = req.params;

  // Controlla se il volo è già nella cache
  if (flightCache[flightCode]) {
    console.log('Dati del volo presi dalla cache');
    return res.json(flightCache[flightCode]);
  }

  try {
    // Chiave API - assicurati di sostituirla con la tua
    const API_KEY = 'AAAAAAAA';

    // Richiesta all'API esterna
    const response = await fetch(
      `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightCode}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Errore nella richiesta all’API esterna' });
    }

    const data = await response.json();

    // Controlla se ci sono risultati
    if (!data || !data.data || data.data.length === 0) {
      return res.status(404).json({ message: 'Volo non trovato' });
    }

    // Prendi il primo risultato
    const flightInfo = data.data[0];

    // Salva i dati del volo in memoria (cache)
    flightCache[flightCode] = flightInfo;

    console.log('Dati del volo salvati in cache');
    res.json(flightInfo);
  } catch (error) {
    console.error('Errore nella ricerca del volo:', error.message);
    res.status(500).json({ message: 'Errore del server' });
  }
});

// Gestione della chiusura del database
process.on('SIGINT', () => {
  if (!useMockDB) {
    db.close((err) => {
      if (err) {
        console.error('Errore durante la chiusura del database:', err.message);
      }
      console.log('Connessione al database chiusa.');
      process.exit(0);
    });
  } else {
    console.log('Mock database chiuso.');
    process.exit(0);
  }
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});

