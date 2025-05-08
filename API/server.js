import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import session from 'express-session';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';
import MockDB from './mock.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { OAuth2Client } from 'google-auth-library';
import { createServer } from 'http';
//import { Server } from 'socket.io';
import dotenv from 'dotenv';
import SQLiteStoreFactory from 'connect-sqlite3'; // Importazione corretta
dotenv.config();

if (!process.env.SECRET_SESSION) {
  throw new Error('SECRET_SESSION non è definita nel file .env');
}

//CHIAVI API
const CLIENT_ID = process.env.CLIENT_ID;
const API_KEY = process.env.API_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SECRET_SESSION = process.env.SECRET_SESSION;

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

// Configurazione del session store SQLite
const SQLiteStore = SQLiteStoreFactory(session); // Utilizzo corretto
const sessionStore = new SQLiteStore({
  db: 'sessions.db', // Nome del file del database SQLite
  table: 'sessions', // Nome della tabella per le sessioni
  concurrentDB: true, // Abilita l'accesso concorrente al database
});

// Middleware
// Middleware
app.use(express.json());

// Nuova configurazione CORS che accetta anche dominio GitHub Codespaces
app.use(
  cors({
    // Include anche i domini di GitHub Codespaces 
    origin: function(origin, callback) {
      const allowedOrigins = [
        'http://localhost:8080',
        'https://www.rimpici.it'
      ];
      
      // Accetta qualsiasi origine che contiene .app.github.dev
      if (!origin || origin.includes('.app.github.dev') || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Origine bloccata da CORS:', origin);
        callback(new Error('Non permesso da CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Gestione esplicita delle richieste preflight OPTIONS
app.options('*', cors());

app.use(
  session({
    store: sessionStore,
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 giorno
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


// websocket
//const httpServer = createServer(app);
//const io = new Server(httpServer, {
  //cors: {
    //origin: ['http://localhost:8080', 'https://www.rimpici.it'],
    //credentials: true
  //}
//});

// Variabili globali per tracciare le connessioni
//const activeConnections = new Set(); // Traccia tutte le connessioni attive
//const adminConnections = new Set(); // Traccia solo le connessioni degli admin
//const activeUsers = new Map(); // Traccia utenti autenticati con i loro dati [socketId -> userData]
//let visitorCount = 0; // Contatore dei visitatori

// Middleware per gestire la sessione utente nelle connessioni WebSocket
//io.use(async (socket, next) => {
  //try {
    //const sessionCookie = socket.handshake.headers.cookie;
    //if (!sessionCookie) return next(); // Consenti connessioni senza cookie

    // Estrai il sessionID dal cookie
    //const sessionID = sessionCookie.split('connect.sid=')[1]?.split(';')[0];
    //if (!sessionID) return next(); // Prosegui anche se il cookie non è presente

    // Recupera la sessione dal session store
    //const sessionStore = app.get('sessionStore');
    //sessionStore.get(sessionID, (err, session) => {
      //if (err || !session) return next(); // Ignora errori e prosegui
      //socket.user = session.user || null; // Collega l'utente alla socket
      //next();
    //});
  //} catch (error) {
    //next(); // Consenti comunque la connessione
  //}
//});

// Funzione per inviare aggiornamenti agli admin
//const emitToAdmins = () => {
  // Prepara la lista di utenti attivi per gli admin
  //const activeUsersList = Array.from(activeUsers.values());
  //const visitorCount = activeConnections.size;
  
  //adminConnections.forEach(socketId => {
    //io.to(socketId).emit('admin_visitor_count', visitorCount);
    //io.to(socketId).emit('admin_active_users', activeUsersList);
  //});
//};

// Gestione delle connessioni WebSocket
//io.on('connection', (socket) => {
  //console.log('Nuova connessione WebSocket:', socket.id);
  //activeConnections.add(socket.id); // Aggiungi la connessione attiva

  //socket.on('disconnect', () => {
    //console.log('Disconnessione WebSocket:', socket.id);
    //activeConnections.delete(socket.id); // Rimuovi la connessione attiva
  //});

  //socket.on('user_connected', (userData) => {
    //if (userData.is_admin) {
      //adminConnections.add(socket.id); // Aggiungi alla lista admin
    //}
    //activeUsers.set(socket.id, userData); // Aggiungi l'utente alla mappa
    //emitToAdmins(); // Invia aggiornamenti agli admin
  //});
  
  //socket.on('user_disconnected', () => {
    //activeUsers.delete(socket.id); // Rimuovi l'utente dalla mappa
    //emitToAdmins(); // Invia aggiornamenti agli admin
  //});

// Configurazione di Passport per il login con Google
passport.use(new GoogleStrategy({
  clientID: CLIENT_ID, // Client ID da Google Cloud
  clientSecret: CLIENT_SECRET, // Client Secret da Google Cloud
  callbackURL: '/auth/google/callback' // URL di callback
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Cerca l'utente nel database tramite l'email di Google
    const email = profile.emails[0].value;
    let user = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    // Se l'utente non esiste, crealo
    if (!user) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO users (username, email, password, age, favorite_airport, is_admin) VALUES (?, ?, ?, ?, ?, 0)`,
          [profile.displayName, email, '', 18, 'N/A'], // Valori di default
          function (err) {
            if (err) reject(err);
            resolve();
          }
        );
      });

      // Recupera l'utente appena creato
      user = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
    }

    // Restituisci l'utente a Passport
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Rotta per avviare il login con Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rotta di callback dopo il login con Google
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Salva l'utente nella sessione
    req.session.user = { id: req.user.id, username: req.user.username, is_admin: req.user.is_admin };
  }
);



// Rotta per il login con Google tramite token ID (per client mobile o SPA)
const client = new OAuth2Client(CLIENT_ID);
/**
 * @swagger
 * /login/google:
 *   post:
 *     summary: Login con Google tramite token ID
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
 *     responses:
 *       200:
 *         description: Login con Google riuscito
 *       401:
 *         description: Autenticazione fallita
 */
app.post('/login/google', async (req, res) => {
  const { token } = req.body; // Token ID inviato dal client

  try {
    // Verifica il token ID con Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload; // Estrai i dati dell'utente

    // Cerca l'utente nel database
    let user = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    // Se l'utente non esiste, crealo
    if (!user) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO users (username, email, password, age, favorite_airport, is_admin) VALUES (?, ?, ?, ?, ?, 0)`,
          [name, email, '', 18, 'N/A'], // Valori di default
          function (err) {
            if (err) reject(err);
            resolve();
          }
        );
      });

      // Recupera l'utente appena creato
      user = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
    }

    // Salva l'utente nella sessione
    req.session.user = { id: user.id, username: user.username, is_admin: user.is_admin };

    // Risposta al client
    res.json({ message: 'Login con Google riuscito', user: req.session.user });
  } catch (error) {
    console.error('Errore durante la verifica del token Google:', error);
    res.status(401).json({ message: 'Autenticazione fallita' });
  }
});

// Configurazione di Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "WorldFlightTracker API",
      version: "1.0.0",
      description: "Documentazione dell'API per il monitoraggio voli e gestione utenti",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local server" }
    ],
  },
  apis: ["./server.js"], // Include le annotazioni da questo file
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//MOCK DB
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


// ============= GESTIONE VOLI PREFERITI =============

// 1. Prima crea la tabella dei preferiti se non esiste già
db.run(`CREATE TABLE IF NOT EXISTS favorite_flights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  flight_key TEXT NOT NULL,
  flight_data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, flight_key)
)`, (err) => {
  if (err) {
    console.error('Errore durante la creazione della tabella favorite_flights:', err);
  } else {
    console.log('Tabella favorite_flights pronta o già esistente');
  }
});

// 2. Middleware di autenticazione per proteggere gli endpoint
const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Autenticazione richiesta' });
  }
  next();
};

// 3. Endpoint per ottenere tutti i voli preferiti dell'utente
app.get('/api/favorites', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    // Query per ottenere tutti i preferiti dell'utente
    db.all(
      'SELECT flight_data FROM favorite_flights WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
      (err, rows) => {
        if (err) {
          console.error('Errore nel recupero dei voli preferiti:', err);
          return res.status(500).json({ message: 'Errore nel recupero dei preferiti' });
        }
        
        // Trasforma i dati JSON memorizzati in oggetti
        const favorites = rows.map(row => JSON.parse(row.flight_data));
        res.json(favorites);
      }
    );
  } catch (error) {
    console.error('Errore nell\'endpoint GET favorites:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

// 4. Endpoint per aggiungere un volo ai preferiti
app.post('/api/favorites', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const flightData = req.body;
    
    // Validazione dei dati minimi
    if (!flightData || !flightData.flight || !flightData.flight.iata || !flightData.flight_date) {
      return res.status(400).json({ message: 'Dati del volo incompleti' });
    }
    
    // Crea una chiave univoca per il volo
    const flightKey = `${flightData.flight.iata}-${flightData.flight_date}`;
    
    // Memorizza l'intero oggetto come JSON
    const flightDataJson = JSON.stringify(flightData);
    
    // Inserisci nel database
    db.run(
      'INSERT INTO favorite_flights (user_id, flight_key, flight_data) VALUES (?, ?, ?)',
      [userId, flightKey, flightDataJson],
      function(err) {
        if (err) {
          // Gestisci il caso in cui il volo sia già nei preferiti (UNIQUE constraint)
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Questo volo è già nei tuoi preferiti' });
          }
          
          console.error('Errore nel salvataggio del volo preferito:', err);
          return res.status(500).json({ message: 'Errore nel salvataggio del preferito' });
        }
        
        res.status(201).json({ 
          message: 'Volo aggiunto ai preferiti con successo',
          id: this.lastID 
        });
      }
    );
  } catch (error) {
    console.error('Errore nell\'endpoint POST favorites:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

// 5. Endpoint per rimuovere un volo dai preferiti
app.delete('/api/favorites/:flightKey', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const flightKey = req.params.flightKey;
    
    if (!flightKey) {
      return res.status(400).json({ message: 'Identificativo del volo mancante' });
    }
    
    // Elimina il volo preferito
    db.run(
      'DELETE FROM favorite_flights WHERE user_id = ? AND flight_key = ?',
      [userId, flightKey],
      function(err) {
        if (err) {
          console.error('Errore nella rimozione del volo preferito:', err);
          return res.status(500).json({ message: 'Errore nella rimozione del preferito' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Volo preferito non trovato' });
        }
        
        res.json({ message: 'Volo rimosso dai preferiti con successo' });
      }
    );
  } catch (error) {
    console.error('Errore nell\'endpoint DELETE favorites:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

// 6. Endpoint per aggiornare i dati di un volo preferito (opzionale ma utile)
app.put('/api/favorites/:flightKey', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const flightKey = req.params.flightKey;
    const updatedFlightData = req.body;
    
    // Validazione dei dati
    if (!flightKey || !updatedFlightData) {
      return res.status(400).json({ message: 'Dati incompleti' });
    }
    
    // Aggiorna i dati del volo
    const flightDataJson = JSON.stringify(updatedFlightData);
    
    db.run(
      'UPDATE favorite_flights SET flight_data = ? WHERE user_id = ? AND flight_key = ?',
      [flightDataJson, userId, flightKey],
      function(err) {
        if (err) {
          console.error('Errore nell\'aggiornamento del volo preferito:', err);
          return res.status(500).json({ message: 'Errore nell\'aggiornamento del preferito' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Volo preferito non trovato' });
        }
        
        res.json({ message: 'Volo preferito aggiornato con successo' });
      }
    );
  } catch (error) {
    console.error('Errore nell\'endpoint PUT favorites:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: integer
 *               favorite_airport:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utente registrato con successo
 *       400:
 *         description: Campi mancanti o non validi
 *       500:
 *         description: Errore del server
 */
// Endpoint per la registrazione
app.post('/register', async (req, res) => {
  const { username, email, password, age, favorite_airport } = req.body;

  if (!username || !email || !password || !age || !favorite_airport) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
  }

  try {
    // Verifica se l'email è già registrata
    const emailExists = await new Promise((resolve, reject) => {
      db.get(`SELECT id FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) reject(err);
        resolve(!!row);
      });
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email già registrata.' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.run(
      `INSERT INTO users (username, email, password, age, favorite_airport, is_admin) VALUES (?, ?, ?, ?, ?, 0)`,
      [username, email, hashedPassword, age, favorite_airport],
      function (err) {
        if (err) {
          console.error('Errore durante la registrazione:', err.message);
          return res.status(500).json({ message: 'Errore del server.' });
        }
        res.status(201).json({ message: 'Utente registrato con successo.', id: this.lastID });
      }
    );
  } catch (error) {
    console.error('Errore durante la registrazione:', error.message);
    res.status(500).json({ message: 'Errore del server.' });
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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login utente
 *     tags: [Auth]
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
 *       401:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore del server
 */
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

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout utente
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout effettuato con successo
 *       500:
 *         description: Errore del server
 */
// Endpoint per il logout
app.post('/logout', (req, res) => {
  // Cancella il cookie della sessione indipendentemente dalla sua esistenza
  res.clearCookie('connect.sid', { 
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  });

  // Se la sessione esiste, tentiamo di distruggerla
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Errore durante la distruzione della sessione:', err.message);
        return res.status(500).json({ message: 'Errore durante il logout' });
      }
      res.json({ message: 'Logout effettuato con successo' });
    });
  } else {
    // Se non c'è una sessione, rispondi comunque con successo
    res.json({ message: 'Logout effettuato con successo' });
  }
});

/**
 * @swagger
 * /session:
 *   get:
 *     summary: Controlla la sessione utente
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Utente autenticato
 *       401:
 *         description: Sessione non valida o utente non loggato
 */
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


/**
 * @swagger
 * /admin/users/filter:
 *   get:
 *     summary: Filtra gli utenti in base all'aeroporto preferito (solo admin)
 *     tags: [Admin]
 *     parameters:
 *       - name: airport
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: BGY
 *     responses:
 *       200:
 *         description: Utenti filtrati con successo
 *       403:
 *         description: Accesso negato
 */
// Endpoint per ottenere tutti gli utenti (solo admin)
app.get('/admin/users', (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.status(403).json({ message: 'Accesso negato. Non sei un admin.' });
  }

  db.all('SELECT id, username, email, age, favorite_airport, is_admin FROM users', (err, rows) => {
    if (err) {
      console.error('Errore nel recupero degli utenti:', err.message);
      return res.status(500).json({ message: 'Errore del server' });
    }
    res.json(rows);
  });
});

/**
 * @swagger
 * /admin/users/filter:
 *   get:
 *     summary: Filtra gli utenti in base all'aeroporto preferito (solo admin)
 *     tags: [Admin]
 *     parameters:
 *       - name: airport
 *         in: query
 *         required: true
 *         description: Codice IATA dell'aeroporto preferito
 *         schema:
 *           type: string
 *           example: BGY
 *     responses:
 *       200:
 *         description: Utenti filtrati con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "RiccardoR"
 *                   email:
 *                     type: string
 *                     example: "riccardo@example.com"
 *                   age:
 *                     type: integer
 *                     example: 25
 *                   favorite_airport:
 *                     type: string
 *                     example: "BGY"
 *       400:
 *         description: Aeroporto mancante per il filtro
 *       403:
 *         description: Accesso negato, utente non admin
 *       500:
 *         description: Errore del server
 */
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


/**
 * @swagger
 * /admin/users/filter/email:
 *   get:
 *     summary: Filtra gli utenti in base all'email (solo admin)
 *     tags: [Admin]
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *         description: Email dell'utente da filtrare
 *         schema:
 *           type: string
 *           example: riccardo@example.com
 *     responses:
 *       200:
 *         description: Utenti filtrati con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "RiccardoR"
 *                   email:
 *                     type: string
 *                     example: "riccardo@example.com"
 *                   age:
 *                     type: integer
 *                     example: 25
 *                   favorite_airport:
 *                     type: string
 *                     example: "BGY"
 *       400:
 *         description: Email mancante per il filtro
 *       403:
 *         description: Accesso negato, utente non admin
 *       500:
 *         description: Errore del server
 */
app.get('/admin/users/filter/email', isAdmin, (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email mancante per il filtro." });
  }

  if (useMockDB) {
    const filteredUsers = db.getAllUsers().filter(user => user.email === email);
    return res.json(filteredUsers);
  }

  db.all(
    `SELECT id, username, email, age, favorite_airport FROM users WHERE email = ?`,
    [email],
    (err, users) => {
      if (err) {
        console.error('Errore nel filtraggio utenti per email:', err.message);
        return res.status(500).json({ message: 'Errore del server' });
      }
      res.json(users);
    }
  );
});

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Elimina un utente specifico (solo admin)
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID univoco dell'utente da eliminare
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Utente eliminato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utente eliminato con successo"
 *       403:
 *         description: Accesso negato, utente non admin
 *       500:
 *         description: Errore del server
 */
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

/**
 * @swagger
 * /admin/visitors:
 *   get:
 *     summary: Ottieni il conteggio visitatori in tempo reale (solo admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Conteggio visitatori
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   example: 42
 *       403:
 *         description: Accesso negato
 */
app.get('/admin/visitors', isAdmin, (req, res) => {
  res.json({ count: visitorCount });
});

// Endpoint per cercare un volo
const flightCache = {};

/**
 * @swagger
 * /api/flights/{flightCode}:
 *   get:
 *     summary: Recupera informazioni di un volo specifico
 *     tags: [Flights]
 *     parameters:
 *       - name: flightCode
 *         in: path
 *         required: true
 *         description: Codice IATA del volo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dati del volo recuperati con successo
 *       404:
 *         description: Volo non trovato
 *       500:
 *         description: Errore del server
 */
app.get('/api/flights/:flightCode', async (req, res) => {
  const { flightCode } = req.params;

  // Controlla se il volo è già nella cache e se è ancora valido (es. 5 minuti)
  if (flightCache[flightCode] && Date.now() - flightCache[flightCode].timestamp < 300000) {
    console.log('Dati del volo presi dalla cache');
    return res.json(flightCache[flightCode].data);
  }

  try {
    const response = await fetch(
      `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flightCode}`
    );

    if (!response.ok) {
      throw new Error('Errore nella richiesta all’API esterna');
    }

    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      return res.status(404).json({ message: 'Volo non trovato' });
    }

    const flightInfo = data.data[0];

    // Salva i dati del volo in cache con un timestamp
    flightCache[flightCode] = {
      data: flightInfo,
      timestamp: Date.now(),
    };

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

/**
 * @swagger
 * /update-password:
 *   post:
 *     summary: Aggiorna la password dell'utente autenticato
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "nuova_password123"
 *     responses:
 *       200:
 *         description: Password aggiornata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password aggiornata con successo."
 *       400:
 *         description: Campi mancanti o non validi
 *       401:
 *         description: Utente non autenticato
 *       500:
 *         description: Errore del server
 */
app.post('/update-password', async (req, res) => {
  const { password } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: 'Devi essere autenticato per aggiornare la password.' });
  }

  if (!password) {
    return res.status(400).json({ message: 'La password è obbligatoria.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.run(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, req.session.user.id],
      function (err) {
        if (err) {
          console.error('Errore durante l\'aggiornamento della password:', err.message);
          return res.status(500).json({ message: 'Errore del server.' });
        }
        res.json({ message: 'Password aggiornata con successo.' });
      }
    );
  } catch (error) {
    console.error('Errore durante l\'hash della password:', error.message);
    res.status(500).json({ message: 'Errore del server.' });
  }
});

/**
 * @swagger
 * /update-airport:
 *   post:
 *     summary: Aggiorna l'aeroporto preferito dell'utente autenticato
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               airport:
 *                 type: string
 *                 example: "FCO"
 *     responses:
 *       200:
 *         description: Aeroporto aggiornato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aeroporto aggiornato con successo."
 *       400:
 *         description: Campi mancanti o non validi
 *       401:
 *         description: Utente non autenticato
 *       500:
 *         description: Errore del server
 */
app.post('/update-airport', (req, res) => {
  const { airport } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: 'Devi essere autenticato per aggiornare l\'aeroporto preferito.' });
  }

  if (!airport) {
    return res.status(400).json({ message: 'L\'aeroporto è obbligatorio.' });
  }

  db.run(
    `UPDATE users SET favorite_airport = ? WHERE id = ?`,
    [airport, req.session.user.id],
    function (err) {
      if (err) {
        console.error('Errore durante l\'aggiornamento dell\'aeroporto:', err.message);
        return res.status(500).json({ message: 'Errore del server.' });
      }
      res.json({ message: 'Aeroporto aggiornato con successo.' });
    }
  );
});

// Endpoint per la creazione di un nuovo utente admin (accessibile solo agli admin)
app.post('/admin/create', isAdmin, async (req, res) => {
  try {
    // Estraggo i dati dalla richiesta
    const { username, email, password, age, favorite_airport } = req.body;

    // Validazione base dei dati
    if (!username || !email || !password || !age) {
      return res.status(400).json({ message: 'Tutti i campi obbligatori devono essere compilati' });
    }

    // Verifica se l'email è già in uso - VERSIONE CORRETTA
    const checkEmailQuery = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const emailCheck = await db.get(checkEmailQuery, [email]);
    
    if (emailCheck && emailCheck.count > 0) {
      return res.status(400).json({ message: 'Email già in uso' });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserimento del nuovo admin nel database
    const result = await db.run(
      'INSERT INTO users (username, email, password, age, favorite_airport, is_admin) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, age, favorite_airport || null, 1]
    );

    // Risposta con successo
    res.status(201).json({ 
      message: 'Amministratore creato con successo',
      userId: result.lastID 
    });
  } catch (error) {
    console.error('Errore nella creazione dell\'admin:', error);
    res.status(500).json({ message: 'Errore durante la creazione dell\'amministratore' });
  }
});

// Endpoint per filtrare gli utenti per email
app.get('/admin/users/filter/email', isAdmin, async (req, res) => {
  try {
    // Estrae il parametro email dalla query
    const email = req.query.email;
    
    if (!email) {
      return res.status(400).json({ message: 'Parametro email mancante' });
    }
    
    // Utilizza LIKE per cercare email che contengono la stringa fornita
    // % è il jolly in SQL, quindi %string% trova qualsiasi email che contiene "string"
    const users = await db.all(
      'SELECT id, username, email, age, favorite_airport, is_admin FROM users WHERE email LIKE ?',
      [`%${email}%`]
    );
    
    // Ritorna gli utenti trovati
    res.json(users);
  } catch (error) {
    console.error('Errore nella ricerca utenti per email:', error);
    res.status(500).json({ message: 'Errore durante la ricerca degli utenti per email' });
  }
});

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});