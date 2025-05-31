const connection = require('../db');

exports.showSignupForm = (req, res) => {
    res.render('signup', {
        title: 'Înregistrare'
    });
};

exports.signupUser = (req, res) => {
    const { name, email, password, role } = req.body;

    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, email, password, role], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.render('signup', {
                    title: 'Înregistrare',
                    name,
                    email,
                    role,
                    error: "Emailul este deja folosit."
                });
            }
            console.error('Eroare la înregistrare:', err);
            return res.status(500).render('signup', {
                title: 'Înregistrare',
                error: "Eroare la înregistrare. Încearcă din nou."
            });
        }
        res.redirect('/login');
    });
};

exports.showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Eroare la login:', err);
            return res.status(500).render('login', {
                title: 'Login',
                error: "Eroare la login. Încearcă din nou."
            });
        }

        if (results.length > 0) {
            const user = results[0];

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            if (user.role === 'organizer') {
                return res.redirect(`/dashboard/organizer/${user.id}`);
            } else {
                return res.redirect(`/dashboard/participant/${user.id}`);
            }
        } else {
            return res.render('login', {
                title: 'Login',
                error: 'Email sau parolă incorectă.'
            });
        }
    });
};

exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Eroare la logout:', err);
            return res.status(500).send('Eroare la logout');
        }
        res.redirect('/login');
    });
};
