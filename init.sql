CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('organizer','participant') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    max_participants INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo VARCHAR(255),
    FOREIGN KEY (organizer_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    participant_id INT NOT NULL,
    tickets INT NOT NULL DEFAULT 1,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);



-- Insert users
INSERT INTO users (name, email, password, role) VALUES
('Alice Organizer', 'alice@event.com', 'hashedpassword1', 'organizer'),
('Bob Participant', 'bob@user.com', 'hashedpassword2', 'participant'),
('Carol Participant', 'carol@user.com', 'hashedpassword3', 'participant');

-- Insert events
INSERT INTO events (organizer_id, title, description, location, event_date, max_participants, photo) VALUES
(1, 'Tech Conference', 'A conference about the latest in tech.', 'New York', '2025-08-01 09:00:00', 200, 'uploads/tech-conference.png'),
(1, 'Startup Pitch Night', 'Pitch your startup ideas.', 'San Francisco', '2025-09-10 18:30:00', 50, 'uploads/pitch-night.png');


INSERT INTO registrations (event_id, participant_id, tickets) VALUES
  (1, 2, 3),  -- Bob registers for 3 tickets to Tech Conference
  (2, 3, 2);  -- Carol registers for 2 tickets to Startup Pitch Night
