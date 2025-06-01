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


exports.dashboard = (req, res) => {
    const user = req.session.user;
    const userId = user.id;

    if (user.role === 'participant') {
        const sql = `
            SELECT e.*,
                   IFNULL(SUM(r.tickets), 0)            AS registered_count,
                   EXISTS (SELECT 1
                           FROM registrations r2
                           WHERE r2.event_id = e.id
                             AND r2.participant_id = ?) AS isRegistered
            FROM events e
                     LEFT JOIN registrations r ON e.id = r.event_id
            GROUP BY e.id
            ORDER BY e.event_date ASC
        `;

        connection.query(sql, [userId], (err, events) => {
            if (err) {
                console.error('Eroare la afișarea evenimentelor:', err);
                return res.status(500).send("Eroare la afișare");
            }

            res.render('dashboard', {
                userRole: 'participant',
                participantId: userId,
                events
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
                userRole: 'organizer',
                organizerId: userId,
                events
            });
        });

    } else {
        res.status(403).send("Rol necunoscut");
    }
};


exports.registerToEvent = (req, res) => {
    const {event_id, participant_id, tickets} = req.body;
    const ticketsCount = parseInt(tickets, 10);

    if (isNaN(ticketsCount) || ticketsCount <= 0) {
        return res.status(400).send("Număr invalid de bilete.");
    }

    const checkExistingSql = `SELECT *
                              FROM registrations
                              WHERE event_id = ?
                                AND participant_id = ?`;

    connection.query(checkExistingSql, [event_id, participant_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Eroare la verificarea înscrierii.");
        }

        if (results.length > 0) {
            return res.status(400).send("Ești deja înscris la acest eveniment.");
        }

        // 2. Verifică locuri disponibile (sumă bilete rezervate + cele dorite <= max_participants)
        const checkSeatsSql = `
            SELECT max_participants,
                   (SELECT COALESCE(SUM(tickets), 0) FROM registrations WHERE event_id = ?) AS booked
            FROM events
            WHERE id = ?
        `;

        connection.query(checkSeatsSql, [event_id, event_id], (err2, eventResults) => {
            if (err2) {
                console.error(err2);
                return res.status(500).send("Eroare la verificarea locurilor disponibile.");
            }

            if (eventResults.length === 0) {
                return res.status(404).send("Evenimentul nu există.");
            }

            const event = eventResults[0];
            const availableSeats = event.max_participants - event.booked;

            if (ticketsCount > availableSeats) {
                return res.status(400).send(`Nu mai sunt suficiente locuri disponibile. Sunt disponibile doar ${availableSeats} bilete.`);
            }

            // 3. Inserează înscrierea cu numărul de bilete
            const insertSql = `INSERT INTO registrations (event_id, participant_id, tickets)
                               VALUES (?, ?, ?)`;
            connection.query(insertSql, [event_id, participant_id, ticketsCount], (err3) => {
                if (err3) {
                    console.error(err3);
                    return res.status(500).send("Eroare la înscriere.");
                }

                res.redirect(`/dashboard/participant/${participant_id}`);
            });
        });
    });
};




