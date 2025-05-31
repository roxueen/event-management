const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SERVER_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(express.static('public'));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Serverul este activ pe http://localhost:${port}`);
});

