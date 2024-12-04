const express = require('express');
const path = require('path');
const mysql = require('mysql2'); 
const fs = require('fs');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Csatlakozás az adatbázishoz
const connection = mysql.createConnection({
  host: 'localhost',      
  user: 'studb032',        
  password: 'xyz456',       
  database: 'db032'          
});

connection.connect(err => {
  if (err) {
    console.error('Sikertelen csatlakozás, hiba:' + err.stack);
    return;
  }
  console.log('Sikeres csatlakozás. ' + connection.threadId);
});

// Termék adatok lekérdezése
app.get('/api/products', (req, res) => {
  const sql = `
    SELECT aru.aru_kod, aru.kat_kod, aru.nev, aru.egyseg, aru.ar, kategoria.kat_nev, eladas.mennyiseg
    FROM aru 
    LEFT JOIN kategoria ON aru.kat_kod = kategoria.kat_kod
    LEFT JOIN eladas ON aru.aru_kod = eladas.aru_kod
    GROUP BY aru.aru_kod;
  `;
  
  connection.query(sql, (err, rows) => {
    if (err) console.error('Hibás lekérdezés. ', err);
    res.json(rows);
  });
});

//Üzenetek
app.post('/api/send-message', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send('Minden mezőt ki kell tölteni!');
    }
  
    const query = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
    connection.query(query, [name, email, message], (err, result) => {
      if (err) {
        console.error('Hiba az üzenet mentésekor:', err);
        res.status(500).send('Hiba történt az üzenet mentésekor.');
      } else {
        res.send('Üzenet sikeresen elküldve!');
      }
    });
  });
  
  app.get('/api/messages', (req, res) => {
    const query = 'SELECT id, name, email, message, sent_at FROM messages ORDER BY sent_at DESC';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Hiba az üzenetek lekérésekor:', err);
        res.status(500).send('Hiba történt az üzenetek lekérésekor.');
      } else {
        res.json(results);
      }
    });
  });

  app.put('/api/messages/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, message } = req.body;
  
    const query = 'UPDATE messages SET name = ?, email = ?, message = ? WHERE id = ?';
    connection.query(query, [name, email, message, id], (err, result) => {
      if (err) {
        console.error('Hiba az üzenet frissítésekor:', err);
        res.status(500).send('Hiba történt az üzenet frissítésekor.');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Nem található ilyen üzenet.');
      } else {
        res.send('Üzenet sikeresen frissítve!');
      }
    });
  });
  
  app.delete('/api/messages/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM messages WHERE id = ?';
    connection.query(query, [id], (err, result) => {
      if (err) {
        console.error('Hiba az üzenet törlésekor:', err);
        res.status(500).send('Hiba történt az üzenet törlésekor.');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Nem található ilyen üzenet.');
      } else {
        res.send('Üzenet sikeresen törölve!');
      }
    });
  });
  


const PORT = 8032;
app.listen(PORT, () => {
  console.log(`A szerver fut`);
});
