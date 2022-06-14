# uni4all Calendar (t1g2)

This document focuses on the work that our group developed for the calendar endpoint.

## Contents

* [Features](#features)
* [Technologies](#technologies)
* [High-level architecture](#high-level-architecture)
* [Design and architecture](#design-and-architecture)
* [API endpoints](#api-endpoints)
* [Future considerations](#future-considerations)


## Features

- Custom user events
    - The user can create, delete, and update custom events - i.e. events that were created by him and don't come from SIGARRA.

- Student timetable and exams data retrieval
    - Retrieve timetable and exams data from their scraping components, process them and fuse them with the custom events.

- SIGARRA event scraping cache
    - The scraped events are stored in cache and updated when they need to be.

- Unified event retrieval API
    - Unified and flexible event retrieval API.

## Technologies

<!--_Instructions: Tools and rationale for choosing them (programming languages, frameworks, libraries, database engines, message queues)._-->

The main stack used is similar to the global uni4all application (express framework with TypeScript).

- Libraries
    - [Luxon](https://moment.github.io/luxon): to handle dates calculation special cases, such as daylight savings time. 
- Database
    - [Postgres](https://www.postgresql.org/): to store all of the calendar events (including custom user-defined events and SIGARRA timetable and exams cache), as they all have similar structure.

## High-level Architecture

![](https://i.imgur.com/hJLmYnD.jpg)

This is the high-level architecture as we would have liked to implement it. It is based on a **layered architecture** as there can be a clear separation of layers. The component that needs explaining is the calendar fusion component - that is where we would decide whether to get the timetable and exams data from sigarra or from the cache, and handle cache operations.

However, we implemented it as a monolith. One limitation to separating it into **independent components** was the scraping components, which were developed coupled with the API and so made it senseless to separate the rest of the processing from that component.

## Design and Architecture

### Results Cache
_Cloud Adoption Pattern_

[Pattern URL](https://kgb1001001.github.io/cloudadoptionpatterns/Microservices/Results-Cache/)

**Context**: We get timetable and exams event data by scraping from SIGARRA. As this is a time and resource consuming task, both on our end and on SIGARRA's end, we should have a way of keeping older results for a certain amount of time before they expire, so that repeated requests can benefit from the same data.

**Mapping**:

![](https://i.imgur.com/y0Zwrql.jpg)

**Consequences**:
- Pros:
    - We reduce the overhead from scraping data from SIGARRA in repeated calls.
- Cons:
    - The cached data can become inconsistent with the data in SIGARRA between cache updates.

### Updating the cached data

Two possible architectures were taken into consideration:

- define a scheduler to generate **events** to update the calendar stored in a cache. This would essential be an [Event-based Architecture](https://kgb1001001.github.io/cloudadoptionpatterns/Event-Based-Architecture/README/) where periodically an event is generated, which triggers a call to the scraping service and updates the events associated with the current user.
    - Advantage:  
        - the data is periodically updated.
    - Disadvantage:
        - this would force to define a scheduler for each student or make calls for all students periodically.
        - this would happen even if a student didn't hasn't requested data for a while.

- **ADOPTED SOLUTION**: on each get request (that requests timetable or exams events) check when was the last time that the data in the cache was updated. If the time that has passed since then is greater than a certain defined threshold (e.g. 1 day), then update the cache and return the response. Otherwise, return the data in the cache.
    - Advantage:
        - the data will be as well updated as in the previous solution.
    - Disadvantage:
        - the first request after the defined cache lifetime will take a little longer because the data is going to be scraped from SIGARRA.
    - We adopted this solution because the **trade-off** between the overhead in, for example, if the cache lifetime is 1 day, *every day scraping every student's data from SIGARRA* vs the *longer waiting time when the user makes his first request* in a while seemed worth it and would reduce the load on SIGARRA and on our service.

## API Endpoints

In this section we describe the API endpoints that were implemented, along with the Microservice API Patterns we used.

### GET `/calendar`

This was shared with `T2G4` and more detailed documentation can be found at [their calendar documentation](https://github.com/FEUP-ASSO-2021-22/uni4all/blob/development/docs/calendar.md).

Our focus was mainly to integrate events from SIGARRA with the custom user events that follow the previously described architecture and design.

#### Patterns

- The use of the [Wish List](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/WishList) pattern allows our users to choose the information they want to receive on each request, avoiding the overhead in the retrieval and transfer of information that they don't need. In this case, we allow the user to choose the type of events he wants to receive: custom, timetable or exams.
- The use of the [Wish Template](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/WishTemplate) pattern allows our users to choose which event parameters they want to receive, through the use of parameters in the request message that have the same structure as the event parameters. For example, do they only need the name of the events? Or the name and date? This allows the user to choose a custom combination.
- as a possible improvement, [Conditional Request](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/ConditionalRequest) could be integrated, for example, to only return the requested data if the data hasn't changed since the user's last request, especially useful for SIGARRA data.

### DELETE `/calendar/event/:id`

This route was created to delete an event from the calendar with the id provided in the path.

An user can delete an event if:
- it exists
- the user performing the request is the user that created the event
- the event is not imported from SIGARRA

#### Possible responses
- `200` Successfully deleted event from calendar
- `400` Id parameter is missing or invalid
- `401` User is not authorized to delete the event
- `403` User is trying to delete an event that comes from another service (SIGARRA)
- `404` Event with the provided id was not found
- `500`  Unexpected error

#### Patterns
- this API endpoint defines a single, primitive data element as parameter in a request message [Atomic Parameter](https://microservice-api-patterns.org/patterns/structure/representationElements/AtomicParameter)
- follows [Master Data Holder](https://microservice-api-patterns.org/patterns/responsibility/informationHolderEndpointTypes/MasterDataHolder) structure
- as a possible improvement, [Request Bundle](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/RequestBundle) could be integrated allowing efficient mass deletion of events into a single request

### PUT `/calendar/event/:id`

This route was created to update an event from the calendar with the id provided in the path.

An user can update an event if:
- it exists
- the user performing the request is the user that created the event
- the event is not imported from SIGARRA
- the provided parameters in the request body are valid 

**Parameters**:
- `summary` event summary
- `description` description of the event
- `location` location of the event
- `date` date of the event n format YYYY-MM-DD
- `startTime` start time of the event HH:MM:SS
- `endTime` end time of the event HH:MM:SS
- `recurrence` the recurrence rule of the event

**Possible responses**:
- `200` Successfully updated event in calendar
- `400` Id parameter is missing or invalid
- `401` User is not authorized to update the event
- `403` User is trying to update an event that comes from another service (SIGARRA)
- `404` Event with the provided id was not found
- `500`  Unexpected error

**Patterns**:
- follows [Master Data Holder](https://microservice-api-patterns.org/patterns/responsibility/informationHolderEndpointTypes/MasterDataHolder) structure
- defines a possible list of parameters to update an event [Atomic Parameter List](https://microservice-api-patterns.org/patterns/structure/representationElements/AtomicParameterList)
- [Wish List](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/WishList): API client is able to inform the API provider at runtime about the data it is interested in, in this case, data it wants to update
- as a possible improvement, [Request Bundle](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/RequestBundle) could be integrated allowing efficient mass update of events into a single request

## Future considerations

**Cloud Adoption Patterns**
By scaling in the amount of users, we could implement a stronger [Microservices Architecture](https://kgb1001001.github.io/cloudadoptionpatterns/Microservices/Microservices-Architecture/), which would be easier to scale, for example by replicating in-demand services. With this, we could also take advantage of [Polyglot Development](https://kgb1001001.github.io/cloudadoptionpatterns/Microservices/Polyglot-Development/), for example, for using Python for scraping from SIGARRA.

**Microservice API patterns**
[Backend Integration](https://microservice-api-patterns.org/patterns/foundation/BackendIntegration) - with the adoption of microservices, we could specify the communication between two or more backends ([Solution Internal API](https://microservice-api-patterns.org/patterns/foundation/SolutionInternalAPI)), being it message-based or event-driven.

As said in more detail during the API endpoints specification above, we could improve the user's interaction with the API by implementing, in the endpoints where it is appropriate, the [Conditional Request](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/ConditionalRequest) and [Request Bundle](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/RequestBundle) patterns.
