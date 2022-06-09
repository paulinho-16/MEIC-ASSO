DROP TABLE IF EXISTS Topic;
DROP TABLE IF EXISTS User_Device;
DROP TABLE IF EXISTS Notifications;


-- Table: Topic
CREATE TABLE Topic(
    id                      SERIAL PRIMARY KEY,
    name                    varchar(100) NOT NULL,
    tokenId                 varchar(100) NOT NULL UNIQUE
);

-- Table: User_Device
CREATE TABLE User_Device(
    userId          varchar(100) NOT NULL,
    deviceToken     varchar(100) NOT NULL
);

-- Table: Notifications
CREATE TABLE Notifications (
    id              SERIAL PRIMARY KEY,
    content         TEXT NOT NULL,
    title           TEXT NOT NULL,
    topicTokenId    varchar(100) NOT NULL,
    userID          INTEGER NOT NULL,
    foreign key (topicTokenId) references Topic(tokenId)
);


INSERT INTO Topic (id, "name", tokenId) VALUES (1, 'Guns', 'c372a3ba-db47-11ec-9d64-0242ac120002');

INSERT INTO User_Device (userId, deviceToken) VALUES (1, 'c372a3ba-db47-11ec-9d64-0242ac120002');

INSERT INTO Notifications (id, content, title, topicTokenId, userID)
Values (1, 'My description 1', 'James Bond 1', 'c372a3ba-db47-11ec-9d64-0242ac120002', 1);