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

// Configurazione middleware CORS
const corsOptions = {
  origin: 'http://www.rimpici.it',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Necessario per le sessioni
};
app.use(cors(corsOptions));

// Parsing JSON
app.use(express.json());

// Configurazione delle sessioni
app.use(
  session({
    secret: 'il-tuo-segreto-unico', // Cambialo con una stringa complessa
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Imposta true se usi HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 giorno
    },
  })
);

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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuovo utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cognome:
 *                 type: string
 *               eta:
 *                 type: integer
 *                 minimum: 16
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               aeroporto_preferenza:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utente registrato con successo
 *       400:
 *         description: Tutti i campi sono obbligatori o età minima non rispettata
 *       500:
 *         description: Errore durante la registrazione
 */
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
    const query = `INSERT INTO utenti (nome, cognome, eta, email, password, aeroporto_preferenza) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [nome, cognome, eta, email, hashedPassword, aeroporto_preferenza], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Errore durante la registrazione: ' + err.message });
      }
      res.status(201).json({ message: 'Utente registrato con successo', id: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante l\'hashing della password' });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Effettua il login di un utente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login riuscito
 *       400:
 *         description: Email e password sono obbligatori
 *       404:
 *         description: Utente non trovato
 *       500:
 *         description: Errore durante la ricerca dell'utente
 */
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password sono obbligatori' });
  }

  const query = `SELECT * FROM utenti WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante la ricerca dell\'utente: ' + err.message });
    }
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

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
  });
});

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Visualizza il profilo utente
 *     responses:
 *       200:
 *         description: Profilo utente
 *       401:
 *         description: Non autenticato
 */
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Non autenticato' });
  }
  res.json({
    message: 'Profilo utente',
    user: req.session.user,
  });
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Effettua il logout
 *     responses:
 *       200:
 *         description: Logout riuscito
 *       500:
 *         description: Errore durante il logout
 */
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Errore durante il logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout riuscito' });
  });
});

// Endpoint per richieste preflight
app.options('*', cors(corsOptions));

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