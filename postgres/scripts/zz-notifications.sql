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
    foreign key (topicTokenId) references Topic(tokenId),
    foreign key (userID) references User_Device(id)
);


INSERT INTO Topic (id, "name", topicTokenId) VALUES (1, 'Guns', 'c372a3ba-db47-11ec-9d64-0242ac120002');
INSERT INTO Topic (id, "name", topicTokenId) VALUES (2, 'Tanks', 'c372a3ba-db47-11ec-9d64-0242ac120002');
INSERT INTO Topic (id, "name", topicTokenId) VALUES (3, 'Grenades', 'c372a3ba-db47-11ec-9d64-0242ac120002');
INSERT INTO Topic (id, "name", topicTokenId) VALUES (4, 'Planes', 'c372a3ba-db47-11ec-9d64-0242ac120002');
INSERT INTO Topic (id, "name", topicTokenId) VALUES (5, 'Arrows', 'c372a3ba-db47-11ec-9d64-0242ac120002');

INSERT INTO User_Device (id, deviceToken) VALUES (1, 'c372a3ba-db47-11ec-9d64-0242ac120002');
INSERT INTO User_Device (id, deviceToken) VALUES (2, 'c372a630-db47-11ec-9d64-0242ac120002');
INSERT INTO User_Device (id, deviceToken) VALUES (3, 'c372a77a-db47-11ec-9d64-0242ac120002');
INSERT INTO User_Device (id, deviceToken) VALUES (4, 'c372a8ba-db47-11ec-9d64-0242ac120002');
INSERT INTO User_Device (id, deviceToken) VALUES (5, 'c372a9dc-db47-11ec-9d64-0242ac120002');

INSERT INTO Notifications (id, content, title, topicTokenId, userID)
Values (1, 'My description 1', 'James Bond 1', 1, 1);
INSERT INTO Notifications (id, content, title, topicTokenId, userID)
Values (2, 'My description 2', 'James Bond 2', 2, 2);
INSERT INTO Notifications (id, content, title, topicTokenId, userID)
Values (3, 'My description 3', 'James Bond 3', 3, 3);
INSERT INTO Notifications (id, content, title, topicTokenId, userID)
Values (4, 'My description 4', 'James Bond 4', 4, 4);
INSERT INTO Notifications (id, content, title, topicTokenId, userID)
Values (5, 'My description 5', 'James Bond 5', 5, 5);