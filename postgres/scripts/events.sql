DROP TABLE IF EXISTS Event;
DROP TABLE IF EXISTS EventUsers;

-- Table: Event
CREATE TABLE Event (
    id              SERIAL PRIMARY KEY,
    summary         TEXT NOT NULL,
    description     TEXT,
    location        TEXT,
    date            DATE,
    start           TIMESTAMP NOT NULL,
    end             TIMESTAMP NOT NULL,
    recurrence      TEXT,
    isUni           BOOLEAN
);

-- Table: EventUsers
CREATE TABLE EventUsers (
    eventId     INTEGER,
    userId      INTEGER,
    FOREIGN KEY (userId) REFERENCES UniUser(id),
    FOREIGN KEY (eventId) REFERENCES Event(id)
);