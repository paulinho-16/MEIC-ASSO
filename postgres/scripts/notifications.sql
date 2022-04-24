DROP TABLE IF EXISTS Notifications;

-- Table: Notifications
CREATE TABLE Notifications (
    id              SERIAL PRIMARY KEY,
    userID          INTEGER NOT NULL,
    description     TEXT NOT NULL,
    author          TEXT NOT NULL
);