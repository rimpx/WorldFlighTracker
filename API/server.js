const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

// Origini consentite
const allowedOrigins = [
  'https://www.rimpici.it',
  'https://redesigned-chainsaw-4xrqq7g4p9w3j6qj-8080.app.github.dev', // Origine locale per sviluppo
];

// Configurazione middleware CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Origine bloccata da CORS:', origin); // Log utile per debug
      callback(new Error('Non consentito da CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Necessario per gestire cookie/sessione
};
app.use(cors(corsOptions));

// Parsing JSON
app.use(express.json());

// Configurazione delle sessioni
app.use(
  session({
    secret: 'il-tuo-segreto-unico',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Abilitato solo in HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 giorno
    },
  })
);

// Middleware per proteggere le rotte private
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Non autenticato' });
  }
  next();
};

// Configurazione del database SQLite
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

// Configurazione Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API per la gestione degli utenti e autenticazione',
    },
    servers: [
      {
        url: 'https://www.rimpici.it/api',
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Endpoint per la registrazione
app.post('/register', async (req, res) => {
  const { nome, cognome, eta, email, password, aeroporto_preferenza } = req.body;

  if (!nome || !cognome || !eta || !email || !password || !aeroporto_preferenza) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }
  if (eta < 16) {
    return res.status(400).json({ error: "L'età minima è di 16 anni" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = `INSERT INTO utenti (nome, cognome, eta, email, password, aeroporto_preferenza) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, cognome, eta, email, hashedPassword, aeroporto_preferenza], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Errore durante la registrazione: ' + err.message });
      }
      res.status(201).json({ message: 'Utente registrato con successo', id: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'hashing della password" });
  }
});

// Endpoint per il login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password sono obbligatori' });
  }

  const query = `SELECT * FROM utenti WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Errore durante la ricerca dell'utente: " + err.message });
    }
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

      req.session.user = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        aeroporto_preferenza: user.aeroporto_preferenza,
      };

      res.json({
        message: 'Login riuscito',
        user: req.session.user,
      });
    } catch (error) {
      res.status(500).json({ error: 'Errore durante il confronto della password' });
    }
  });
});

// Endpoint per il profilo
app.get('/profile', requireAuth, (req, res) => {
  res.json({
    message: 'Profilo utente',
    user: req.session.user,
  });
});

// Endpoint per il logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante il logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout riuscito' });
  });
});

// Rotte non definite
app.use((req, res) => {
  res.status(404).json({ error: 'Risorsa non trovata' });
});

// Gestione della chiusura del database
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

// Avvio del server
app.listen(port, () => {
  console.log(`Server API in esecuzione su http://localhost:${port}`);
});