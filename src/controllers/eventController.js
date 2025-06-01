const connection = require('../db');

exports.index = (req, res) => {
    connection.query('SELECT * FROM events', (err, results) => {
        if (err) {
            console.error('Eroare la interogare:', err);
            return res.status(500).send('Eroare la interogare');
        }
        res.render('main', {
            user: req.session.user,
            events: results,
        });
    });
};

exports.showEventDetails = (req, res) => {
    const eventId = req.params.id;

    connection.query('SELECT * FROM events WHERE id = ?', [eventId], (err, results) => {
        if (err) {
            console.error('Eroare la interogare:', err);
            return res.status(500).send('Eroare la interogare');
        }

        if (results.length > 0) {
            res.render('eventDetails', {
                user: req.session.user,
                event: results[0],
            });
        } else {
            res.status(404).send('Evenimentul nu a fost găsit.');
        }
    });
};


exports.dashboard = (req, res) => {
    const user = req.session.user;
    const userId = user.id;

    if (user.role === 'participant') {
        const sql = `
            SELECT
                e.*,
                IFNULL(SUM(r.tickets), 0) AS registered_count,
                MAX(CASE WHEN ur.participant_id IS NOT NULL THEN 1 ELSE 0 END) AS isRegistered
            FROM events e
                     LEFT JOIN registrations r ON e.id = r.event_id
                     LEFT JOIN registrations ur ON e.id = ur.event_id AND ur.participant_id = ?
            GROUP BY e.id
            ORDER BY e.event_date ASC
        `;

        connection.query(sql, [userId], (err, events) => {
            if (err) {
                console.error('Eroare la afișarea evenimentelor:', err);
                return res.status(500).send("Eroare la afișare");
            }

            console.log(events);

            res.render('dashboard', {
                user: req.session.user,
                events: events
            });
        });

    } else if (user.role === 'organizer') {
        const sql = `
            SELECT *
            FROM events
            WHERE organizer_id = ?
            ORDER BY event_date DESC
        `;

        connection.query(sql, [userId], (err, events) => {
            if (err) {
                console.error('Eroare la dashboard:', err);
                return res.status(500).send("Eroare la afișare");
            }

            res.render('dashboard', {
                user: req.session.user,
                events: events
            });
        });

    } else {
        res.status(403).send("Rol necunoscut");
    }
};

exports.showCreateForm = (req, res) => {
    res.render('createEvent', {
        user: req.session.user,
    });
};

exports.createEvent = (req, res) => {
    const user = req.session.user;
    const {title, description, location, event_date, max_participants} = req.body;
    const photo = req.file ? `uploads/${req.file.filename}` : null;

    const sql = `
        INSERT INTO events (organizer_id, title, description, location, event_date, max_participants, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        user.id,
        title,
        description,
        location,
        event_date,
        max_participants,
        photo
    ];

    connection.query(sql, params, (err) => {
        if (err) {
            console.error('Eroare la inserarea evenimentului:', err);
            return res.status(500).send('Eroare la inserarea evenimentului');
        }
        res.redirect('/dashboard');
    });
};

exports.deleteEvent = (req, res) => {
    const user = req.session.user;
    const eventId = req.body.event_id;

    const sql = `DELETE FROM events WHERE id = ? AND organizer_id = ?`;

    connection.query(sql, [eventId, user.id], (err, result) => {
        if (err) {
            console.error('Eroare la ștergerea evenimentului:', err);
            return res.status(500).send('Eroare la ștergerea evenimentului');
        }

        if (result.affectedRows === 0) {
            return res.status(403).send('Nu ai permisiunea să ștergi acest eveniment.');
        }

        res.redirect('/dashboard');
    });
};


exports.registerToEvent = (req, res) => {
    const { event_id, participant_id, tickets } = req.body;
    const ticketsCount = parseInt(tickets);

    const sql = `
        INSERT INTO registrations (event_id, participant_id, tickets)
        VALUES (?, ?, ?)
    `;

    connection.query(sql, [event_id, participant_id, ticketsCount], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Eroare la înscriere.");
        }

        res.redirect('/dashboard');
    });
};



