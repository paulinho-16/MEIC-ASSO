# ASSO Documentation T2G2

---
# Capacity <!-- omit in toc -->

Uni4all capacity implementation.

## Table of Contents<!-- omit in toc -->

- [Current Features](#current-features)
- [High-level Architecture](#high-level-architecture)
- [Technologies](#technologies)
- [API Endpoints](#api-endpoints)
- [Future Work](#future-work)

## Current Features

- get capacity of the FEUP's parking lots
- get number of current free/occupied spaces in the FEUP's parking lots

## High-level Architecture

The following component diagram shows the capacity implementation.

![High Level Architecture](https://user-images.githubusercontent.com/29897562/174665556-e06afe2f-c475-4b43-b957-e8e9c0b0cc0d.png)

## Technologies

- [Axios](https://github.com/axios/axios): to scrape contents from SIGARRA.

## API Endpoints

For more detailed documentation, refer to the swagger hub documentation.

### `GET` /capacity

Returns a json with information related to the total capacity of the FEUP's parking lots, as well as the number of current occupied and free spaces for each one (lively updated).
Receives no parameters.

- Possible responses:
  - `200`: Successful operation
  - `500`: Internal error

- Response example:
  - ```json
    {
      "p1lotacao": 525,
      "p3lotacao": 325,
      "p4lotacao": 50,
      "data": "20220524",
      "P1in": 395,
      "P1out": 525,
      "P3in": 47,
      "P3out": 41,
      "P4in": 525,
      "P4out": 235,
      "p1ocupados": 160,
      "p3ocupados": 145,
      "p4ocupados": 6,
      "p1livres": 365,
      "p3livres": 180,
      "p4livres": 44
    }
    ```
## Design and architecture

### Scrapping  

#### **Context**:  
We want to scrape the contents provided by a sigarra link. We use the [Retrieval Operation Pattern](https://microservice-api-patterns.org/patterns/responsibility/operationResponsibilities/RetrievalOperation), where the user performs a read-only operation to request a report that contains a machine-readable representation of the requested information.

#### **Mapping**:  
![Retrieval Operation Mapping](https://user-images.githubusercontent.com/29897562/174668575-6f9e2eda-e626-4500-b19c-e876b7597234.png)  
This image represents how the user uses the API to send a GET Capacity request and the Retrieval Operation scrapes the information from the sigarra link.

#### **Consequences**:
##### Pros
- Workload management: Due to their read-only nature, Retrieval Operations can scale by replicating data.
- Networking efficiency vs. data parsimony (message sizes): Retrieval Operations can make full use of identifiers, can fetch, cache, and optimize local data on demand (note: there is no need for all of this data to appear in the request).
##### Cons:
- May become a performance bottleneck if user information needs and query capabilities do not match.

## Future Work

Search, filter, and formatting capabilities could be added to the [Retrieval Operation](https://microservice-api-patterns.org/patterns/responsibility/operationResponsibilities/RetrievalOperation) instead of returning the information just as it was scrapped.