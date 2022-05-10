DROP TABLE IF EXISTS Event;

-- Table: User
CREATE TABLE Event (
    id              SERIAL PRIMARY KEY,
    email        TEXT UNIQUE NOT NULL,
    password        TEXT NOT NULL
);