# ASSO Documentation T2G2

---
# Queues<!-- omit in toc -->

Uni4all queues implementation.
It was uses the same nomenclature for identifying the restaurants that were defined in the meals endpoint.

## Table of Contents<!-- omit in toc -->

- [ASSO Documentation T2G2](#asso-documentation-t2g2)
  - [Current Features](#current-features)
  - [High-level Architecture](#high-level-architecture)
  - [Technologies](#technologies)
  - [API Endpoints](#api-endpoints)
    - [`GET` /queue](#get-queue)
    - [`POST` /queue](#post-queue)
  - [Future Work](#future-work)

## Current Features

- queues status
  - see current status of queues of a specific FEUP restaurant/cafeteria
  - post queue status for specific FEUP restaurant/cafeteria

## High-level Architecture

The following component diagram shows the queues implementation.

![High Level Architecture](https://i.imgur.com/4J3b6w7.png)

## Technologies

- Database
  - **postgreSQL**, to store all the meals and teachers reviews.

## API Endpoints

For more detailed documentation, refer to the [swagger hub](https://uni4all.servehttp.com/api-docs/#/Queues) documentation.

### `GET` /queue

Returns a queue's status.
To obtain the queue's status, the `restauntant` field is required.

- Receives the following parameters:
  - `restaurant`: ID code of the restaurant, one of [2,4,5,6,7,8]. 2 -> grill, 4-> cafeteria, 5-> inegi, [6,7] -> cantina FEUP, 8 -> inesctec

- Possible responses:
  - `200`: Queue status received
  - `400`: Bad request
  - `500`: Internal error

- Response example:

```json
{
  "average_value": 4.33,
  "last_entry_value": 5,
  "last_entry_timestamp": "2022-04-22T00:00:00.000Z"
}
```

The `average_value` is obtained from the reviews posted in the last 30 minutes, where the more recent ones have more weight.

All the information is acquired through a [Wish List](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/WishList) where the user specifies what he wishes to look for.
Communication and processing faults are replied with an [Error Report](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/ErrorReport) where the response message indicates and classifies the fault in a simple, machine-readable way.

### `POST` /queue

Creates a new queue status.

- Receives the following arguments:
  - `restaurant`: ID code of the restaurant, one of [2,4,5,6,7,8]. 2 -> grill, 4-> cafeteria, 5-> inegi, [6,7] -> cantina FEUP, 8 -> inesctec
  - `author`: Author of the review
  - `value`: Queue status value. Value => [0,5].

```json
{
  "restaurant": 6,
  "author": "Filipe",
  "value": 2
}
```

- Possible responses:
  - `200`: Queue updated
  - `400`: Bad request
  - `500`: Internal error

When updating the queue status, it utilizes the reviews from the last 30 minutes, where the more recent ones have more weight.
Communication and processing faults are replied with an [Error Report](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/ErrorReport) where the response message indicates and classifies the fault in a simple, machine-readable way.

## Future Work

Interesting things that could be done are the implementation of [Conditional Request](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/ConditionalRequest) in order to avoid unnecessary server-side processing and bandwidth usage be avoided when invoking API operations that return rarely changing data and the implementation of [Request Bundle](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/RequestBundle) to assemble multiple requests into a single request message.
