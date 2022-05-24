DROP TABLE IF EXISTS Topic;
DROP TABLE IF EXISTS User_Device;
DROP TABLE IF EXISTS Notifications;


-- Table: Topic
CREATE TABLE Topic(
    id                      SERIAL PRIMARY KEY,
    name                    varchar(100) NOT NULL
);

-- Table: User_Device
CREATE TABLE User_Device(
    id              SERIAL PRIMARY KEY,
    deviceToken     varchar(100) NOT NULL
);

-- Table: Notifications
CREATE TABLE Notifications (
    id              SERIAL PRIMARY KEY,
    description     varchar(100) NOT NULL,
    author          varchar(100) NOT NULL,
    topicID         INTEGER NOT NULL,
    userID          INTEGER NOT NULL,
    foreign key (topicID) references Topic(id),
    foreign key (userID) references User_Device(id)
);


INSERT INTO Topic (id, "name") VALUES (1, 'Guns');
INSERT INTO Topic (id, "name") VALUES (2, 'Tanks');
INSERT INTO Topic (id, "name") VALUES (3, 'Grenades');
INSERT INTO Topic (id, "name") VALUES (4, 'Planes');
INSERT INTO Topic (id, "name") VALUES (5, 'Arrows');

INSERT INTO User_Device (id, deviceToken) VALUES (1, 'c372a3ba-db47-11ec-9d64-0242ac120002');
INSERT INTO User_Device (id, deviceToken) VALUES (2, 'c372a630-db47-11ec-9d64-0242ac120002');
INSERT INTO User_Device (id, deviceToken) VALUES (3, 'c372a77a-db47-11ec-9d64-0242ac120002');
INSERT INTO User_Device (id, deviceToken) VALUES (4, 'c372a8ba-db47-11ec-9d64-0242ac120002');
INSERT INTO User_Device (id, deviceToken) VALUES (5, 'c372a9dc-db47-11ec-9d64-0242ac120002');

INSERT INTO Notifications (id, "description", author, topicID, userID)
Values (1, 'My description 1', 'James Bond 1', 1, 1);
INSERT INTO Notifications (id, "description", author, topicID, userID)
Values (2, 'My description 2', 'James Bond 2', 2, 2);
INSERT INTO Notifications (id, "description", author, topicID, userID)
Values (3, 'My description 3', 'James Bond 3', 3, 3);
INSERT INTO Notifications (id, "description", author, topicID, userID)
Values (4, 'My description 4', 'James Bond 4', 4, 4);
INSERT INTO Notifications (id, "description", author, topicID, userID)
Values (5, 'My description 5', 'James Bond 5', 5, 5);