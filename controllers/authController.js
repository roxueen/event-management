const connection = require('../db');

// === DEFINIRE FUNCȚII ===

// Afișează formularul de login
function showLoginForm(req, res) {
  res.render('login'); // views/login.ejs
}

// Procesează datele de login
function loginUser(req, res) {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?'; // NOTĂ: folosește bcrypt în producție
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Eroare la login:', err);
      return res.status(500).send('Eroare la server');
    }

    if (results.length > 0) {
      const user = results[0];

      // Redirectare în funcție de tipul de utilizator
      if (user.role === 'participant') {
        res.redirect(`/dashboard/participant/${user.id}`);
      } else {
        res.redirect(`/create-event/${user.id}`); // Organizer merge la formularul de creare eveniment
      }
    } else {
      res.send('Email sau parolă incorectă.');
    }
  });
}

// Afișează formularul de signup
function showSignupForm(req, res) {
  res.render('signup');
}

// Procesează datele de înregistrare
function signupUser(req, res) {
  const { name, email, password, confirm, role } = req.body;

  if (password !== confirm) {
    return res.send("Parolele nu se potrivesc.");
  }

  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  connection.query(sql, [name, email, password, role], (err, result) => {
    if (err) {
      console.error('Eroare la salvarea utilizatorului:', err);
      return res.status(500).send("Eroare la salvarea utilizatorului.");
    }
    res.redirect('/login');
  });
}

// === EXPORT ===
module.exports = {
  showLoginForm,
  loginUser,
  showSignupForm,
  signupUser
};
