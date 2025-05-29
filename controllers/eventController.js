const connection = require('../db'); // conexiune DB

// Afișează toate evenimentele (pagina principală)
exports.index = (req, res) => {
  connection.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error('Eroare la interogare:', err);
      return res.status(500).send('Eroare la interogare');
    }
    res.render('main', { events: results });
  });
};

// Afișează detaliile unui eveniment
exports.showEventDetails = (req, res) => {
  const eventId = req.params.id;

  connection.query('SELECT * FROM events WHERE id = ?', [eventId], (err, results) => {
    if (err) {
      console.error('Eroare la interogare:', err);
      return res.status(500).send('Eroare la interogare');
    }

    if (results.length > 0) {
      res.render('eventDetails', { event: results[0] }); // Asigură-te că ai un view pentru detalii
    } else {
      res.status(404).send('Evenimentul nu a fost găsit.');
    }
  });
};


// Formular creare eveniment (primește organizerId din URL)
exports.showCreateForm = (req, res) => {
  const organizerId = req.params.organizerId;
  res.render('createEvent', { organizerId }); // trimite organizerId la view
};

// Creare eveniment (folosește organizerId din URL, restul din body)
exports.createEvent = (req, res) => {
  const organizerId = req.params.organizerId;
  const { title, description, location, event_date, max_participants } = req.body;
  const maxParts = max_participants || 100;

  const sql = `INSERT INTO events (organizer_id, title, description, location, event_date, max_participants) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [organizerId, title, description, location, event_date, maxParts];

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error('Eroare la inserarea evenimentului:', err);
      return res.status(500).send('Eroare la inserarea evenimentului');
    }
    res.redirect('/');
  });
};

// Dashboard participant (primește participantId din URL)
exports.participantDashboard = (req, res) => {
  const participantId = req.params.id;

  // Exemplu simplu: afișăm toate evenimentele (poți extinde să afișezi doar cele la care participă)
  connection.query('SELECT * FROM events', (err, events) => {
    if (err) {
      console.error('Eroare la afișarea evenimentelor:', err);
      return res.status(500).send("Eroare la afișarea evenimentelor");
    }
    res.render('participantDashboard', { participantId, events });
  });
};

// Formular login
exports.showLoginForm = (req, res) => {
  res.render('login');
};

// Procesare login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Eroare la login:', err);
      return res.status(500).send('Eroare la server');
    }

    if (results.length > 0) {
      const user = results[0];
      // redirect după rol
      if (user.type === 'organizer') {
        res.redirect(`/create-event/${user.id}`);
      } else {
        res.redirect(`/dashboard/participant/${user.id}`);
      }
    } else {
      res.send('Email sau parolă incorectă.');
    }
  });
};

// Formular signup (dacă vrei să-l pui aici)
exports.showSignupForm = (req, res) => {
  res.render('signup');
};

// Procesare signup (ar trebui să validezi, criptezi parola, etc.)
exports.signupUser = (req, res) => {
  const { name, email, password, confirm, type } = req.body;

  if (password !== confirm) {
    return res.send("Parolele nu coincid.");
  }

  const sql = 'INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, email, password, type], (err, result) => {
    if (err) {
      console.error('Eroare la înregistrare:', err);
      return res.status(500).send('Eroare la înregistrare');
    }
    res.redirect('/login');
  });
};
