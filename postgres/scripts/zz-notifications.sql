DROP TABLE IF EXISTS Topic;
DROP TABLE IF EXISTS User_Device;
DROP TABLE IF EXISTS Notification_Error_Log;
DROP TABLE IF EXISTS Notification_Ignore;
DROP TABLE IF EXISTS Notifications;

-- Table: Topic
CREATE TABLE Topic(
    id                      SERIAL PRIMARY KEY,
    name                    varchar(100) NOT NULL UNIQUE,
    tokenId                 varchar(100) NOT NULL UNIQUE
);

-- Table: User_Device
CREATE TABLE User_Device(
    userId          varchar(100) NOT NULL,
    deviceToken     varchar(1000) NOT NULL
);

-- Table: Notification_Ignore
CREATE TABLE Notification_Ignore(
    userId          varchar(100) NOT NULL,
    topicName       varchar(100) NOT NULL
);

-- Table: Notifications
CREATE TABLE Notifications (
    id              SERIAL PRIMARY KEY,
    content         TEXT NOT NULL,
    title           TEXT NOT NULL,
    topicTokenId    varchar(100) NOT NULL,
    userID          INTEGER NOT NULL
);

CREATE TABLE Notification_Error_Log (
    id              SERIAL PRIMARY KEY,
    code            INTEGER NOT NULL,
    description     TEXT
);
