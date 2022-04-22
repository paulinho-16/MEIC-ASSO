DROP TABLE IF EXISTS MealReview;
DROP TABLE IF EXISTS TeacherReview;

-- Table: MealReview
CREATE TABLE MealReview (
    id              SERIAL PRIMARY KEY,
    description     TEXT NOT NULL,
    author          TEXT NOT NULL,
    date            DATE NOT NULL,
    establishment   TEXT NOT NULL,
    dish            TEXT NOT NULL,  
    rating          INTEGER NOT NULL
);


-- Table: TeacherReview
CREATE TABLE TeacherReview (
    id           SERIAL PRIMARY KEY,
    description  TEXT NOT NULL,
    author       TEXT NOT NULL,
    date         DATE NOT NULL,
    class        TEXT NOT NULL,
    teacher      TEXT NOT NULL
);
