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