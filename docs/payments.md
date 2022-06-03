# Payments

Uni4all payments backend implementation.

> **for developers**: write this as you build.
>
> **for outsiders 👀**: take into account that this is still a WiP, and as such, this document represents the actual state of the implementation.

## Current features

- Get the current balance of a user
- Get the movements' table of a user

## API Endpoints

For more detailed documentation, refer to the swagger hub documentation.

### `GET` /payments

Gets a user's payments history.
- Returns ```200``` if the operation was successful
- Returns a student's up number, name, nif, balance and movement's table.

## Architecture and choices

![Sequence diagram](https://i.imgur.com/JdQKXdF.png)

The client will make a request to the Flutter Middleware, which will be authenticated and scrape, process and return the user data, in this case the Payments Page HTML, to the Payments Component. 

Then, the payments endpoint, having the HTML of the payments page, will get the relevant information and return it (the user identification data and the balance).

## Technologies

- **backend:** node.js
    - with framework express, because it is fast, well documented and easy to integrate with swagger
- **scraping:** cheerio
    - Very fast and effective, adequate for scraping static content
- **database:** Redis
    - Open source, fast and has a cache which is suited for distributed environments/Microservice architecture.


