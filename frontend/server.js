const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/login', (_, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/panel', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/citas', (_, res) => res.sendFile(path.join(__dirname, 'public', 'citas.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`INFO  Frontend en http://localhost:${PORT}`));
