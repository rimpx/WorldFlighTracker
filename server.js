const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; 

const app = express();

app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Richiesta di login per l'utente ${username}`);

    try {
        const data = await fs.readFile('utenti.json', 'utf8');
        const utenti = JSON.parse(data);
        const user = utenti.find(u => u.username === username && u.password === password);
        
        if (user) {
            res.status(200).json({ message: "Login effettuato con successo" });
        } else {
            res.status(401).json({ message: "Credenziali non valide" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore durante la lettura del file o parsing" });
    }
});

app.get('/api/utenti', async (req, res) => {
    try {
        const data = await fs.readFile('utenti.json', 'utf8');
        const utenti = JSON.parse(data);
        res.status(200).json(utenti);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore durante la lettura del file" });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: "Username e password sono richiesti" });
        return;
    }

    try {
        const data = await fs.readFile('utenti.json', 'utf8');
        const utenti = JSON.parse(data);
        
        const userExists = utenti.find(u => u.username === username);
        if (userExists) {
            res.status(409).json({ message: "L'utente esiste già" });
            return;
        }

        utenti.push({ username, password });
        await fs.writeFile('utenti.json', JSON.stringify(utenti, null, 2));

        res.status(201).json({ message: "Registrazione avvenuta con successo" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore durante la registrazione" });
    }
});

app.put('/edit', async (req, res) => {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        res.status(400).json({ message: "Username e nuova password sono richiesti" });
        return;
    }

    try {
        const data = await fs.readFile('utenti.json', 'utf8');
        const utenti = JSON.parse(data);
        
        const userIndex = utenti.findIndex(u => u.username === username);
        if (userIndex === -1) {
            res.status(404).json({ message: "Utente non trovato" });
            return;
        }

        utenti[userIndex].password = newPassword;
        await fs.writeFile('utenti.json', JSON.stringify(utenti, null, 2));

        res.status(200).json({ message: "Password aggiornata con successo" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore durante l'aggiornamento della password" });
    }
});

app.delete('/delete', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        res.status(400).json({ message: "Username è richiesto" });
        return;
    }

    try {
        const data = await fs.readFile('utenti.json', 'utf8');
        let utenti = JSON.parse(data);

        const newUsers = utenti.filter(u => u.username !== username);
        
        if (newUsers.length === utenti.length) {
            res.status(404).json({ message: "Utente non trovato" });
            return;
        }

        await fs.writeFile('utenti.json', JSON.stringify(newUsers, null, 2));

        res.status(200).json({ message: "Utente eliminato con successo" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Errore durante l'eliminazione dell'utente" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});
