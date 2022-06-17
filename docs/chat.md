# Chat<!-- omit in toc -->

Uni4all chat backend implementation.

> **for developers**: write this as you build.
>
> **for outsiders 👀**: take into account that this may not be the final implementation of the chat; as the backend evolves, it is due to change.

## Table of Contents<!-- omit in toc -->

- [Current Features](#current-features)
- [High-level Architecture](#high-level-architecture)
- [Technologies](#technologies)
- [Design and Architecture](#design-and-architecture)
- [Contributing](#contributing)
- [API Endpoints](#api-endpoints)
  - [`GET` /chat/location](#get-chatlocation)
  - [`GET` /chat/:group/message](#get-chatgroupmessage)
  - [`GET` /chat/message](#get-chatmessage)
- [Mongo Chat Server Endpoints](#mongo-chat-server-endpoints)
  - [Groups](#groups)
    - [`GET` /group/](#get-group)
    - [`GET` /group/:id/](#get-groupid)
    - [`GET` /group/messages](#get-groupmessages)
    - [`GET` /group/user/:up](#get-groupuserup)
    - [`POST` /group/](#post-group)
  - [Messages](#messages)
    - [`GET` /message/](#get-message)
    - [`GET` /message/:id](#get-messageid)
    - [`POST` /message/](#post-message)
  - [Users](#users)
    - [`GET` /user/](#get-user)
    - [`POST` /user/:up](#post-userup)
- [Chat socket events](#chat-socket-events)
- [Operations](#operations)
  - [Non Functional Requirements](#non-functional-requirements)
    - [Fitness Functions](#fitness-functions)
    - [Logging](#logging)
- [Future Work](#future-work)
  - [Architectural Goals](#architectural-goals)

## Current Features

- chat client
  - see all user's groups
  - see all groups messages
  - send messages
- chat server
  - create new chat
  - join chat
  - leave chat
  - get groups or group (by id)
  - get group messages w/ **pagination**
  - get user's groups
  - create new message
  - update user info: username, name and whether is online or not

## High-level Architecture

The following component diagram comprises the chat implementation. No activity or deployment diagram are displayed since there's no real use case for them in the chat component.

![High Level Architecture](https://user-images.githubusercontent.com/55626181/173329466-9950bf8f-49f0-4602-af01-2510c8da59f2.png)

For communication with the client, the chat server needs to send messages autonomously. For this polling, long-polling, and websockets are possibilities. Polling and long-polling are more demanding computationally, hence the coice for **websockets**.

## Technologies

- Chat server
  - **websockets** socket.io, is a common solution for most real-time chat systems, providing a bi-directional communication channel between a client and a server. It focus equally on reliability and speed.
  - **backend** node.js with framework express, because is the most well documented technology with socket.io and socket.io is built on top of node.js.
- Database
  - **mongoDB**, because there is no need to define schemas allowing for a more flexibility in the development. Is good for a large dataset, low latency and low response times. As it is a NoSQL database it has the characteristics of it, it was designed for fast and simple questions, large dataset and frequent application changes. It also scales well horizontally allowing more machines to be added and handle the data across multiple servers. Concluding: flexibility, scalability, high-performance, availability, highly functional.

## Design and Architecture

In the current state of the implementation, the chat backend does not have a complex structure. The chat backend consists of 3 microservices:

- Chat Server
 
Responsible for direct communication with the clients. The clients will send the messages to the chat server which will, in real time, resend the same messages to the receiver clients. The communication between clients and the chat server is done via web sockets. Other options were available, such as polling, long-polling. However, these are more demanding computationally.

- Mongo Chat Server

Provides a communication interface for the database. When any other service in the backend wishes to communicate with the chat database, it should do so by making requests to the Mongo Chat Server.

- Mongo Service

Key-Value database for chat.

---

Most communications between microservices occur using the **messages** pattern. This is due to its simplicity and  modularization. Mongo chat server provides a REST API, awaiting requests in the form of messages, responding with a message as well. Even when the communication channel is a web socket - a stream of data - the meaningful information is compartmentalized into messages. The communication between the Mongo Chat Server and the actual Mongo Server is done via a library called [sequelize](https://sequelize.org).

When the chat server sends a message to a group, it is using [socket.io's `.to(room)` function](https://socket.io/docs/v4/#broadcasting). It is not clear how the implementation is done, precisely, however, on a higher level, **Publisher-Subscriber** is applied. When a client joins a group, the chat server makes the call `socket.join(room)`, which is parallel to a subscription; and when a message is sent to a group, the chat server calls `io.to(room).emit(...)`, which is parallel to a publication. In this scenario, every user in a group is both a publisher and a subscriber.

---

Besides the developed backend we also implemented a simple UI, _Chat Client_, that displays the specified user's groups and chat, providing an easier and more interactive interface to test and debug the chat features. Functionally, it behaves as a client that connects to a socket on _Chat Server_ and emits events on users connections and messages.

---

## Contributing

The only requirement to set up the development environment is having [Docker](https://www.docker.com/) installed.

For the chat to be operational it needs three containers working: mongo-chat, mongo-chat-server and chat-server. The order by whitch they must go up can be seen and set up in the docker-compose, using _depends_on_: mongo-chat goes first to launch the mongo service, then mongo-chat-server that depends on mongo-chat, creating a server to use the mongo database, and lastly chat-server that depends on mongo-chat-server, creating the chat server for communication with the client.

To build and run these containers for development, run the `docker-compose -f docker-compose.dev.yml up --build` command. With this development docker-compose file the services reload the changes made to files automatically.

Check docker-compose _mongo-chat_, _mongo-chat-server_ and _chat-server_ services' ports to see which endpoints to acess in order to use those containers.

## API Endpoints

For more detailed documentation, refer to the swagger hub documentation.

### `GET` /chat/location

Gets the URL for the client to connect with.
To be used when the client wants to connect a socket to a chat server.

### `GET` /chat/:group/message

Gets messages for a given group.
This may be useful for when, for example, the user opens a chat group and scrolls up.

- [Information Holder Resource](https://microservice-api-patterns.org/patterns/responsibility/endpointRoles/InformationHolderResource);
- Returns a [Parameter Forest](https://microservice-api-patterns.org/patterns/structure/representationElements/ParameterForest) with information regarding each received message;
- Given the sheer amount of possible messages, includes [Pagination](https://microservice-api-patterns.org/patterns/structure/compositeRepresentations/Pagination):
  - If the page is not requested it returns the first page.

### `GET` /chat/message

Gets all possible messages.

- Really a [Request Bundle](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/RequestBundle) that verifies the groups in which the logged client is in, and performs a bunch of `/chat/:group/message` requests;
- Returns a [Parameter Forest](https://microservice-api-patterns.org/patterns/structure/representationElements/ParameterForest) with a list of groups, and a list of messages per group;
- Given the sheer amount of possible messages, includes [Pagination](https://microservice-api-patterns.org/patterns/structure/compositeRepresentations/Pagination):
  - If the page is not requested it returns the first page.

## Mongo Chat Server Endpoints

To access the mongo chat server, use the following URL:

```
http://mongo_chat_server:3000/
```

### Groups

#### `GET` /group/

Gets all groups.

- Returns a [Parameter Forest](https://microservice-api-patterns.org/patterns/structure/representationElements/ParameterForest) with a list of groups;
- Pagination is not supported.

#### `GET` /group/:id/

Gets a group given a id.

- Needs the id of the group to get.

#### `GET` /group/messages

Gets all messages for a given group with pagination.

- Returns a [Parameter Forest](https://microservice-api-patterns.org/patterns/structure/representationElements/ParameterForest) with a list of messages per group;
- Given the sheer amount of possible messages, includes [Pagination](https://microservice-api-patterns.org/patterns/structure/compositeRepresentations/Pagination).
- Receives the following arguments:
  - `groupID`: the group to get the messages for;
  - `page`: the page to get (starts at 0);
  - `perPage`: the amount of messages per page.

```json
{
  "groupID": String required,
  "page": Number required,
  "perPage": Number required
}
```

#### `GET` /group/user/:up

Gets all groups for a given user.

- Returns a [Parameter Forest](https://microservice-api-patterns.org/patterns/structure/representationElements/ParameterForest) with a list of groups;
- Needs the username of the user to get the groups for.

#### `POST` /group/

Creates a new group.

- Receives the following arguments:
  - `name`: the name of the group;
  - `users`: the users that are part of the group.

```json
{
  "name": String required,
  "users": [String] required
}
```

### Messages

#### `GET` /message/

Gets all messages with pagination.

- Returns a [Parameter Forest](https://microservice-api-patterns.org/patterns/structure/representationElements/ParameterForest) with a list of messages;
- Given the sheer amount of possible messages, includes [Pagination](https://microservice-api-patterns.org/patterns/structure/compositeRepresentations/Pagination).
- Receives the following arguments:
  - `page`: the page to get (starts at 0);
  - `perPage`: the amount of messages per page.

```json
{
  "page": Number required,
  "perPage": Number required
}
```

#### `GET` /message/:id

Gets a message given an id.

- Needs the id of the message to get.

#### `POST` /message/

Creates a new message.

- Receives the following arguments:
  - `group`: the group the message is for;
  - `from`: the user that sent the message;
  - `message`: the message itself.

```json
{
  "group": String required,
  "from": String required,
  "message": String required
}
```

### Users

#### `GET` /user/

Gets all users.

- Returns a [Parameter Forest](https://microservice-api-patterns.org/patterns/structure/representationElements/ParameterForest) with a list of users;
- Pagination is not supported.

#### `POST` /user/:up

Updates user.

- Needs the username of the user to update.
- Receives the following arguments:
  - `username`: the new username;
  - `name`: the new name;
  - `online`: the new online status.

```json
{
  "username": String,
  "name": String,
  "online": Boolean
}
```

## Chat socket events

- In `/server` expect an implementation of a chat server.
- In `/client` expect an implementation of a frontend that tests and demonstrates the chat features.

There are different kinds of events:

- **connection**: receives the socket created between the client and the server and happens when the socket is created between client and server;

```js
{
    socket: String
}
```

- **online**: receives the up (identifier of the user) that is getting online and happens when a user goes online in the app;

```js
{
  up: String
}
```

- **disconnect**: receives the up (identifier of the user) that is disconnecting and happens when a user goes offline;

```js
{
  up: String
}
```

- **chat message**: receives the message to be sent to the chat, the up(identifier) from the user sending, the chat room (identifier) for where it is being sent, and the timestamp when it was sent. This happens whenever a user sends a message to a chat room;

```js
{
  message: String
  up: String,
  room: String,
  timestamp: String
}
```

- **join room**: receives the up(identifier) from the user joining, and the chat room (identifier) it is joining. This happens when a user joins a new chat room.

```js
{
  up: String
}
```

This implementation has event-driven architecture where the client emits events and triggers the communication with the server.

---

## Operations

**! TODO**

- how to deploy to production

The deployment to production is made along with the rest of the containers using GitHub actions.

- how to operate the system
- how to run and access fitness functions

### Non Functional Requirements

The code is modular, so new features can easily be added.
Code convention are maintained using Eslint, a JavaScript linter that enables the enforcement of a set of style, formatting, and coding standards for the code, with airbnb rules.

#### Fitness Functions

Based on [ISO 25010](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010).

| Name                                                                    | Type        | Quality Attribute | Min Value | Ideal Value | Max Value | Automation                                                                                                                                                                   |
| ----------------------------------------------------------------------- | ----------- | ----------------- | --------- | ----------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The number of users online per time unit                                | Performance | Capacity          | 10 000    | -           | -         | Not on production, connect Y amount of machines                                                                                                                              |
| Latency: Time spent to send a chat message                              | Performance | Time Behaviour    | -         | 1sec        | 10sec     | Send message to self every X seconds and calculate the time between sending and receiving                                                                                    |
| Channel capacity: The number of messages we are able to send per X time | Performance | Capacity          | 1/5sec    | 1/1sec      | -         | Send a set of messages in a given rate to self, and calculate the time between sending and receiving, and verify if this time is still in between the acceptable time bounds |
| Respond to unusual number of simultaneous requests (such as DDOS)       | Reliability | Availability      | -         | 20 000 000  | -         | Try a DDoS attack every X time                                                                                                                                               |
| Have a relatively high uptime with MTBF / MTRS                          | Reliability | Maturity          | 99%       | 100%        | -         | Try to connect to the chat server every X seconds, checking if its up or down, calculating MTBF / MTRS                                                                       |
| CVE Analysis, should not use libraries with known vulnerabilities       | Security    | -                 | -         | 0           | 0         | Defect tracking software                                                                                                                                                     |

---

#### Logging

In order to identify and observe the behavior of the system, logs are used.

For the mongo chat server there are three different log files in the `logs` folder:

- `requests.log`, contains the HTTP requests that are sent to the server in the Standard Apache Combined Log Format;
- `combined.log`, contains the combined logs of the system that have an importance level of `info` or less;
  - each log line has the level (`info`, `warning`, `error`), the message, the service (default `app`), timestamp and other optional metadata;
  - example:
  
  ```log
  info: app started listening on port 3000 {"service":"app","timestamp":"2022-06-13T12:15:43.333Z"}
  info: connected to database {"service":"database","timestamp":"2022-06-13T12:15:43.365Z"}
  info: populating database... {"service":"database","timestamp":"2022-06-13T12:15:43.365Z"}
  info: populated database {"service":"database","timestamp":"2022-06-13T12:15:43.415Z"}
  ```

- `error.log`, contains the combined logs of the system that have an importance level of `error` or less;
  - each log line has the message, the service (default `app`), timestamp and other optional metadata;
  - example:
  
  ```log
  error: failed to populate database FALHOU DE PROPOSITO VOU DEIXAR O COPILOT COMPLETAR ESTA FRASE: "O copilot completa esta frase" {"service":"app","timestamp":"2022-06-13T12:18:27.544Z"}
  error: failed to populate database FALHOU DE PROPOSITO VOU DEIXAR O COPILOT COMPLETAR ESTA FRASE: "O copilot completa esta frase" {"service":"app","timestamp":"2022-06-13T13:58:35.100Z"}
  ```

For the chat server there are two different log files in the `logs` folder:

- `combined.log`, same behaviour as in the mongo chat server
- `error.log`, same behaviour as in the mongo chat server

## Future Work

There were some tasks we were not able to implement because of the delay in finding a solution to work without the authentication from Sigarra.

Ideally, the messages would only be kept in our database until they were read by the user. Once the user has read them, they would be stored in the app's local storage and deleted from the database, as is the case of well-known apps such as Signal and Whatsapp.

Some further enhancements we had in mind were to allow to see who was online of that chat (if any user is online, the chat would be highlighted in a different colour in the frontend, for example); allow sending files and images; cache the messages and mark them as read and lastly, knowing everyone involved in their academic life, have the feature of creating chat groups with the people of the same social circle (everyone the user interacts in their academic life).

### Architectural Goals

![Blank diagram-3](https://user-images.githubusercontent.com/52630567/173246529-14f0934b-9e7a-4d49-b214-4e68875a6979.png)

As the chat application scaled users, one would have to scale its architecture, as well.

For that, the most important choice, would be to increase the number of chat servers, this is, the number of servers that communicate directly with clients. To achieve this, one would have to split the clients by chat servers. This could be done in 2 ways:

- by doing it dynamically;
- by pre-assigning a server to a client.

Since we know that the users of this are FEUP students, we know a priori that they have a UP number. We can use that number to determine the chat server in which the client must connect to. For example, if we had 10 chat servers available, we could assign the chat server taking into account the last digit of the user's UP number. With this strategy, we can also scale dynamically. For example, if the chat server for the digit number 3 became went full, the system could launch yet another server for the same digit, and they could split the connections taking into account the last 2 digits: one would receive the clients that ended between 03 and 43, and the other would take care of the ones in between 53 and 93.

To achieve this, all chat servers are to be connected to a dispatcher. When the API requests a new connection for a client, it does so by requesting the dispatcher. Understanding the current state of the chat servers, the dispatcher then assigns the current server to the client, returning its URL.

To send a message to a group, a client needs to send the message to its chat server. The chat server will check the other members of the group, and to the ones that belong to the same server, it will send the message directly. Most of the time, not all members will be in the same chat server. In those occasions, the chat server sends the message to the chat dispatcher, which will redirect the message to the correct servers.

Given that the influx to both the dispatcher and the chat servers is going to be giant, one communicates with them not through REST, but rather through a queue, such as Kafka.

The same goes for the database. Given that multiple messages will only be stored temporarily in the system, a single database enough. But multiple chat servers will talk to the database at once. To optimize this process, one makes these communications via queue.
