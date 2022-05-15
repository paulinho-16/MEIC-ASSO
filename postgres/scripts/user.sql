DROP TABLE IF EXISTS UniUser;

-- Table: User
CREATE TABLE UniUser (
    id                  SERIAL PRIMARY KEY,
    email               TEXT UNIQUE NOT NULL,
    password            TEXT NOT NULL
);