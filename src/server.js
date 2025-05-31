const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Serverul este activ pe http://localhost:${port}`);
});

