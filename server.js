const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const dbPath = path.join(__dirname, 'db', 'db.json');

app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    })
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        newNote.id = notes.length + 1;
        notes.push(newNote);
        fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

app.delete('/apt/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const updatedNotes = notes.filter(note => note.id !== id);
        fs.writeFile(dbPath, JSON.stringify(updatedNotes), (err) => {
            if (err) throw err;
            res.json({message: 'Note deleted.'});
        });
    });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);