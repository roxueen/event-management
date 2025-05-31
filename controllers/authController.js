const connection = require('../db');

// Afișează formular login
exports.showLoginForm = (req, res) => {
  res.render('login');
};

// Procesare login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?'; // bcrypt recomandat!
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Eroare la login:', err);
      return res.status(500).send('Eroare la server');
    }

    if (results.length > 0) {
      const user = results[0];
      return user.role === 'organizer'
        ? res.redirect(`/dashboard/organizer/${user.id}`)
        : res.redirect(`/dashboard/participant/${user.id}`);
    } else {
      return res.send('Email sau parolă incorectă.');
    }
  });
};

// Afișează formular signup
exports.showSignupForm = (req, res) => {
  res.render('signup');
};

// Procesare signup
exports.signupUser = (req, res) => {
  const { name, email, password, confirm, role } = req.body;

  if (password !== confirm) {
    return res.send("Parolele nu se potrivesc.");
  }

  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, email, password, role], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send("Emailul este deja folosit.");
      }
      console.error('Eroare la înregistrare:', err);
      return res.status(500).send('Eroare la înregistrare.');
    }

    res.redirect('/login');
  });
};
