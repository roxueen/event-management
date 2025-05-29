const express = require('express');
const path = require('path'); 
const app = express();
const port = 3000;

// Importăm rutele
const indexRoutes = require('./routes/eventRoutes'); 
const authRoutes = require('./routes/authRoutes');

// Middleware pentru body parsing
app.use(express.urlencoded({ extended: true }));

// Setează motorul de template la EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Verifică dacă ai directorul views

// Servește fișierele statice (CSS, JS, imagini, etc.)
app.use(express.static('public'));

// Folosește rutele
app.use('/', indexRoutes);

// Pornește serverul
app.listen(port, () => {
  console.log(`Serverul este activ pe http://localhost:${port}`);
});

app.use('/', authRoutes);
