# ASSO Documentation T2G2

---
# Feedback<!-- omit in toc -->

Uni4all feedback implementation.

## Table of Contents<!-- omit in toc -->

- [Current Features](#current-features)
- [High-level Architecture](#high-level-architecture)
- [Technologies](#technologies)
- [API Endpoints](#api-endpoints)
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

## Future Work

Interesting things that could be done are the implementation of [Conditional Request](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/ConditionalRequest) in order to avoid unnecessary server-side processing and bandwidth usage be avoided when invoking API operations that return rarely changing data and the implementation of [Request Bundle](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/RequestBundle) to assemble multiple requests into a single request message.