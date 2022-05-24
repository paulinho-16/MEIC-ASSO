# Chat

Uni4all chat backend implementation.

> **for developers**: write this as you build.
>
> **for outsiders 👀**: take into account that this is still a WiP, and as such, this document represents the actual state of the implementation.

## Current Features

- chat globally
- chat directly to another user
- notifications for user connections and disconnections
- update user username

## Architecture and Choices

```mermaid
flowchart LR
    client[Client]
    chat-server[Chat Server]
    client -->|websocket| chat-server
```

For communication with the client, the chat server needs to send messages autonomously. For this polling, long-polling, and websockets are possibilities. Polling and long-polling are more demanding computationally, hence the coice for **websockets**.

## Socket Endpoints

### Receiving

- `connection`: (implicit) on a new connection
- `disonnect`: (implicit) on a disconnection
- `username`: to update a username
  - msg (string): the new username
- `chat message`: to send a chat message
  - msg (string): the message
  - to (string): the recipient

### Sending

- `notification`: a notification
  - msg (string): the message
- `private message`: a private message
  - sender (string): the sender
  - msg (string): the message
- `chat message`: a general message
  - sender (string): the sender
  - msg (string): the message

## Technologies

- chat server
  - **backend** node.js
  - **websockets** socket.io

## Operations

### Non Functional Requirements

#### Fitness Functions

Based on [ISO 25010](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010).

|Name                                                                   |Type       |Quality Attribute|Min Value|Ideal Value|Max Value|Automation                                                                                                                                                                  |
|-----------------------------------------------------------------------|-----------|-----------------|---------|-----------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|The number of users online per time unit                               |Performance|Capacity         |10 000   |-          |-        |Not on production, connect Y amount of machines                                                                                                                             |
|Latency: Time spent to send a chat message                             |Performance|Time Behaviour   |-        |1sec       |10sec    |Send message to self every X seconds and calculate the time between sending and receiving                                                                                   |
|Channel capacity: The number of messages we are able to send per X time|Performance|Capacity         |1/5sec   |1/1sec     |-        |Send a set of messages in a given rate to self, and calculate the time between sending and receiving, and verify if this time is still in between the acceptable time bounds|
|Respond to unusual number of simultaneous requests (such as DDOS)      |Reliability|Availability     |-        |20 000 000 |-        |Try a DDoS attack every X time                                                                                                                                              |
|Have a relatively high uptime with MTBF / MTRS                         |Reliability|Maturity         |99%      |100%       |-        |Try to connect to the chat server every X seconds, checking if its up or down, calculating MTBF / MTRS                                                                      |
|CVE Analysis, should not use libraries with known vulnerabilities      |Security   |-                |-        |0          |0        |Defect tracking software                                                                                                                                                    |
