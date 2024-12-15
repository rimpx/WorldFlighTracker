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

// Aggiorna la tabella users per includere il campo is_admin
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
  } catch (error) {
    console.error('Errore durante l\'hashing della password:', error.message);
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
        is_admin: user.is_admin, // Deve essere presente
      };

      console.log('Sessione impostata:', req.session.user); // Log sessione dopo login
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
  console.log('Verifica sessione:', req.session); // Log dettagliato della sessione

  if (!req.session.user || !req.session.user.id) {
    console.warn('Sessione non valida o utente non loggato');
    return res.status(401).json({ isAuthenticated: false, message: "Sessione non valida o utente non autenticato" });
  }

  console.log('Recupero informazioni per ID utente:', req.session.user.id);

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
});

// Endpoint per ottenere tutti gli utenti (solo admin)
app.get('/admin/users', isAdmin, (req, res) => {
  db.all(`SELECT id, username, email, age, favorite_airport FROM users`, (err, users) => {
    if (err) {
      console.error('Errore nel recupero degli utenti:', err.message);
      return res.status(500).json({ message: 'Errore del server' });
    }
    res.json(users);
  });
});

// Endpoint per filtrare gli utenti in base all'aeroporto (solo admin)
app.get('/admin/users/filter', isAdmin, (req, res) => {
  const { airport } = req.query;

  if (!airport) return res.status(400).json({ message: "Aeroporto mancante per il filtro." });

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
