const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors'); // Importa cors
const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10; // Numero di round per l'hashing della password

app.use(cors()); 

app.use(express.json());

let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Errore durante la connessione al database:', err.message);
  } else {
    console.log('Connesso al database degli utenti.');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS utenti (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  eta INTEGER NOT NULL CHECK(eta >= 16),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  aeroporto_preferenza TEXT NOT NULL
)`);

app.post('/register', async (req, res) => {
  const { nome, cognome, eta, email, password, aeroporto_preferenza } = req.body;

  if (!nome || !cognome || !eta || !email || !password || !aeroporto_preferenza) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }
  if (eta < 16) {
    return res.status(400).json({ error: 'L\'età minima è di 16 anni' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO utenti (nome, cognome, eta, email, password, aeroporto_>
                   VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, cognome, eta, email, hashedPassword, aeroporto_preferenza], f>
      if (err) {
        return res.status(500).json({ error: 'Errore durante la registrazione: ' + err>
      }
      res.status(201).json({ message: 'Utente registrato con successo', id: this.lastI>
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante l\'hashing della password' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password sono obbligatori' });
  }

  const query = `SELECT * FROM utenti WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante la ricerca dell\'utente: ' >
    }
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    res.json({
      message: 'Login riuscito',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        aeroporto_preferenza: user.aeroporto_preferenza
      }
    });
  });
});

const gracefulShutdown = () => {
  db.close((err) => {
    if (err) {
      console.error('Errore durante la chiusura del database:', err.message);
    } else {
      console.log('Connessione al database chiusa.');
    }
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

app.listen(port, () => {
  console.log(`Server API in esecuzione su http://localhost:${port}`);
});
