DROP TABLE IF EXISTS UniUser;

-- Table: User
CREATE TABLE UniUser (
    id              SERIAL PRIMARY KEY,
    username        TEXT UNIQUE NOT NULL,
    password        TEXT NOT NULL,
    token           TEXT NOT NULL
);