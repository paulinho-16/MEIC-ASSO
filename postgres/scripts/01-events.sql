DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS EventUsers;
DROP TYPE IF EXISTS EventType;

CREATE TYPE EventType AS ENUM ('CUSTOM', 'TIMETABLE', 'EXAM', 'PUBLIC');

-- Table: Event
CREATE TABLE Events (
    id              SERIAL PRIMARY KEY,
    summary         TEXT NOT NULL,
    description     TEXT,
    location        TEXT,
    date            DATE NOT NULL,
    startTime       TIMESTAMP NOT NULL,
    endTime         TIMESTAMP NOT NULL,
    recurrence      TEXT,
    type            EventType
);

-- Table: EventUsers
CREATE TABLE EventUsers (
    eventId     INTEGER,
    userId      INTEGER,
    FOREIGN KEY (userId) REFERENCES UniUser(id) ON DELETE CASCADE,
    FOREIGN KEY (eventId) REFERENCES Events(id) ON DELETE CASCADE
);

CREATE TABLE CalendarScrapingControl (
    userId      INTEGER,
    eventType   EventType,
    lastScraped DATE NOT NULL,
    FOREIGN KEY (userId) REFERENCES UniUser(id) ON DELETE CASCADE,
    PRIMARY KEY (userId, eventType)
);
