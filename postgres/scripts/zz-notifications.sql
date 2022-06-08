DROP TABLE IF EXISTS Topic;
DROP TABLE IF EXISTS User_Device;
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
    deviceToken     varchar(100) NOT NULL
);

-- Table: Notificatio_Ignore
CREATE TABLE Notificatio_Ignore(
    userId          varchar(100) NOT NULL,
    topicName       varchar(100) NOT NULL,	
    foreign key (userId) references User_Device(userId),
    foreign key (topicName) references Topic(name)    
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

CREATE TABLE Notification_Error_Log (
    id              SERIAL PRIMARY KEY,
    code            INTEGER NOT NULL,
    description     TEXT
);
