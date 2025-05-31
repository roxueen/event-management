const connection = require('../db');


exports.showSignupForm = (req, res) => {
  res.render('signup', {
    name: '',
    email: '',
    role: '',
    error: ''
  });
};


exports.signupUser = (req, res) => {
  const { name, email, password, role } = req.body;

  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, email, password, role], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.render('signup', {
          name: name,
          email: email,
          role: role,
          error: "Emailul este deja folosit." });
      }
      console.error('Eroare la înregistrare:', err);
      return res.status(500).render('signup', { error: "Eroare la înregistrare. Încearcă din nou." });
    }
    res.redirect('/login');
  });
};

exports.showLoginForm = (req, res) => {
  res.render('login');
};

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
      return user.role === 'organizer'
        ? res.redirect(`/dashboard/organizer/${user.id}`)
        : res.redirect(`/dashboard/participant/${user.id}`);
    } else {
      return res.send('Email sau parolă incorectă.');
    }
  });
};
