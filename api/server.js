const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.json());

const connectWithRetry = () => {
    const db = mysql.createPool({
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'dbexam',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database: ', err);
            console.log("Retrying in 2 seconds");
            setTimeout(connectWithRetry, 2000);
        }
        if (connection) {
            console.log('Connected to database');
            connection.release();
        }
    });
    return db;
}

const db = connectWithRetry();



app.get('/', (req, res) => {
    res.send("Bienvenue à l'examen Docker");
});

app.get('/books', (req, res) => {
    const genre = req.query.genre;
    console.log("request", req.query);
    console.log("genre :", genre);
    console.log("url", req.url)

    let sql = 'SELECT * FROM books';
    let values = [];

    if (genre) {
        sql += ' WHERE genre = ?'; 
        values.push(genre);
    }

    db.query(sql, values, (err, rows) => {
        if (err) {
            console.error('Erreur lors de l’exécution de la requête', err);
            res.status(500).send('Erreur lors de l’exécution de la requête');
        } else {
            res.json(rows);
        }
    });
});

app.post('/books', (req, res) => {
    const { name, genre } = req.body;
    db.query('INSERT INTO books (name, genre) VALUES (?, ?)', [name, genre], (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).send('Error executing query');
        } else {
            db.query('SELECT * FROM books', (err, rows) => { // Retourne la liste mise à jour
                if (err) {
                    console.error('Erreur lors de la récupération des livres', err);
                    res.status(500).send('Erreur lors de la récupération des livres');
                } else {
                    res.status(201).json(rows); // Envoie la liste mise à jour au front
                }
            });
        }
    });
});


app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;

    db.query('DELETE FROM books WHERE id = ?', [bookId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression du livre', err);
            res.status(500).send('Erreur lors de la suppression du livre');
        } else {
            db.query('SELECT * FROM books', (err, rows) => { // Retourne la liste mise à jour
                if (err) {
                    console.error('Erreur lors de la récupération des livres', err);
                    res.status(500).send('Erreur lors de la récupération des livres');
                } else {
                    res.status(200).json(rows); // Envoie la liste mise à jour au front
                }
            });
        }
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
