# ASSO Documentation T2G2

---
# Feedback<!-- omit in toc -->

Uni4all feedback implementation.

## Table of Contents<!-- omit in toc -->

- [Current Features](#current-features)
- [High-level Architecture](#high-level-architecture)
- [Technologies](#technologies)
- [API Endpoints](#api-endpoints)
- [Design and Architectural Patterns](#design-and-architectural-patterns)
- [Future Work](#future-work)

## Current Features

- meal feedback
  - see all meals reviews
  - see a specific meal review
  - post a meal review
- teacher feedback
  - see all teachers reviews
  - see a specific teacher review
  - post a teacher review

## High-level Architecture

The following component diagram shows the feedback implementation.

![High Level Architecture](https://i.imgur.com/AJGZi5F.png)

## Technologies

- Database
  - **postgreSQL**, to store all the meals and teachers reviews.

## API Endpoints

For more detailed documentation, refer to the swagger hub documentation.

### `GET` /feedback/meal

Returns a meal's review.
To obtain the meals' review, all the parameters are required even if their value is empty.

- Receives the following parameters:
  - `description`: Description of the review. If empty it will consider every description
  - `author `: Author of the review. If empty it will consider every author
  - `date`: Date of the review. If empty it will consider every date
  - `restaurant`: Restaurant of the review. If empty it will consider every restaurant
  - `dish`: Dish of the review. If empty it will consider every dish
  - `rating`: Rating of the review. If empty it will consider every rating. Value of rating => [0,5].

- Possible responses:
  - `200`: Successful operation
  - `400`: Invalid status value
  - `500`: Internal error

- Response example:
  - ```json
    {
      "description": "Muito bom!",
      "author": "João",
      "date": "2022-04-22T00:00:00.000Z",
      "restaurant": "Cantina",
      "dish": "Carne",
      "rating": 5
    }
    ```
    
All the information is acquired through a [Wish List](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/WishList) where the user specifies what he wishes to look for.
Communication and processing faults are replied with an [Error Report](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/ErrorReport) where the response message indicates and classifies the fault in a simple, machine-readable way.

### `GET` /feedback/teacher

Returns a teacher's review.
Obtain the teacher's review, all the parameters are required even if their value is empty.

- Receives the following parameters:
  - `description`: Description of the review. If empty it will consider every description
  - `author `: Author of the review. If empty it will consider every author
  - `date`: Date of the review. If empty it will consider every date
  - `class`: Class of the review. If empty it will consider every class
  - `teacher`: Teacher of the review. If empty it will consider every teacher

- Possible responses:
  - `200`: Successful operation
  - `400`: Invalid status value
  - `500`: Internal error

- Response example:
  - ```json
    {
      "description": "Muito bom!",
      "author": "João",
      "date": "2022-04-22T00:00:00.000Z",
      "class": "ASSO",
      "teacher": "Ademar"
    }
    ```
    
All the information is acquired through a [Wish List](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/WishList) where the user specifies what he wishes to look for.
Communication and processing faults are replied with an [Error Report](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/ErrorReport) where the response message indicates and classifies the fault in a simple, machine-readable way.

### `POST` /feedback/meal

Creates a new meal review.

- Receives the following arguments:
  - `description`: Description of the review
  - `author`: Author of the review
  - `date`: Date of the review
  - `restaurant`: Restaurant of the review
  - `dish`: Dish of the review
  - `rating`:  Rating of the review

```json
{
  "description": "Muito bom!",
  "author": "João",
  "date": "2022-04-22T00:00:00.000Z",
  "restaurant": "Cantina",
  "dish": "Carne",
  "rating": 5
}
```

- Possible responses:
  - `200`: Successful operation
  - `400`: Bad request
  - `500`: Internal error

Communication and processing faults are replied with an [Error Report](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/ErrorReport) where the response message indicates and classifies the fault in a simple, machine-readable way.
 
### `POST`/feedback/teacher

Creates a new teacher review.

- Receives the following arguments:
  - `description`: Description of the review
  - `author`: Author of the review
  - `date`: Date of the review
  - `class`: Class of the review
  - `teacher`: Teacher of the review

```json
{
  "description": "Muito bom!",
  "author": "João",
  "date": "2022-04-22T00:00:00.000Z",
  "class": "ASSO",
  "teacher": "Ademar"
}
```

- Possible responses:
  - `200`: Successful operation
  - `400`: Bad request
  - `500`: Internal error

`Classes` and `teachers` must be checked for authenticity. These entities must exist. Through [Backend Integration](https://microservice-api-patterns.org/patterns/foundation/BackendIntegration) the classes and teachers are checked through the `/curricular-unit` endpoint for their existence.
Communication and processing faults are replied with an [Error Report](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/ErrorReport) where the response message indicates and classifies the fault in a simple, machine-readable way.

## Design and Architectural Patterns

### [Atomic Parameter List](https://microservice-api-patterns.org/patterns/structure/representationElements/AtomicParameterList)

#### Context

Uni4all API wants to offer Post and Get Feedback Operations to its clients. To enable communication, they need to agree on the structure of each message to be exchanged. Our API offers a list of Atomic Parameters that the clients must follow to communicate with the service.

#### Mapping

In the [API Endpoints](#api-endpoints), we can see the list of parameters that must be used in each endpoint.

#### Consequences

##### Pros
- Understandability of the API Endpoints usage.
- Simple structure of the messages.
- If additional data needs to be transmitted with the message (in future updates), this pattern adapts easily.

##### Cons
- If the list of parameters becomes too large is better to switch to a Parameter Tree or a Parameter Forest.

### [Error Report](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/ErrorReport)

#### Context

The feedback service needs to report the results of its operations to the user so that he knows if his request was successful. At the same time, the request must conform to the HTTP response format so that the client App knows how to proceed depending on the error code.

#### Mapping

Every endpoint from feedback responds with a status code, as we can see in the [API Endpoints](#api-endpoints), as well as with a detailed error message.

#### Consequences

##### Pros
- Allows the client to handle errors programmatically.
- A textual error message can explain in more detail what happened.
- The textual message can also include hints to solve the code.

##### Cons
- Compared to a single scalar error code, a detailed textual message is at a higher risk of exposing provider-side implementation details or other sensitive data (valuable to malicious attackers).
- The message may need to be internationalized to reach the end-user.

## Future Work

Interesting things that could be done are the implementation of [Conditional Request](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/ConditionalRequest) in order to avoid unnecessary server-side processing and bandwidth usage be avoided when invoking API operations that return rarely changing data and the implementation of [Request Bundle](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/RequestBundle) to assemble multiple requests into a single request message.
