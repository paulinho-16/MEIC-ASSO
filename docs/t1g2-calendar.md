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

![](https://i.imgur.com/QEHnGyk.jpg)

This is the high-level architecture as we would have liked to implement it. It is based on a **layered architecture** as there can be a clear separation of layers. The component that needs explaining is the calendar fusion component - that is where we would decide whether to get the timetable and exams data from sigarra or from the cache, and handle cache operations.

However, we implemented it as a monolith. One limitation to separating it into **independent components** was the scraping components, which were developed coupled with the API and so made it senseless to separate the rest of the processing from that component.

The following activity diagram shows how data flows in this service:

![](https://i.imgur.com/QEvV6tw.jpg)

## Design and Architecture

### Wish List

_Microservice API Pattern_

[Pattern URL](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/WishList)

**Context**: Since there are multiple types of events present in the calendar, it can be of the user's interest to retrieve only one type or a specific combination of those types events. We should have a way of letting users specify a combination of event types to be retrieved. The same contextualization applies when selecting the parameters to update an event.

**Mapping**: In this case, we allow the user to choose the type of events he wants to receive: custom, timetable or exams. For example: `https://uni4all.servehttp.com/calendar?wishlist=custom`. In the case of an update the user should include in the **request body** the list of parameters he wishes to update and the respective values. [Here](https://github.com/FEUP-ASSO-2021-22/uni4all/blob/a4567403bb2927143e97050c91aa2aba4e61c4e3/api/src/controller/calendar.controller.ts#L200) is the function where we validate the incoming wishlist.

**Consequences**: 
- Pros:
    - Allows for better personalization of each request, meeting user needs and avoids the overhead in the retrieval and transfer of information that they don't need.
    - In the case of an update, not all parameters are updated only the selected ones.
- Cons:
    - Can become unnecessarily complex in case of simple use cases.
    - Extra parameters in the request url may confuse novice users.

---

### Wish Template

_Microservice API Pattern_

[Pattern URL](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/WishTemplate)

**Context**: Since each calendar event has many data fields, the API end user may only be interested in a few of them. For example, do they only need the name of the events? Or the name and date? The application of this pattern gives the user the option to choose a custom combination.

**Mapping**: Through the use of parameters in the request message that have the same structure as the event parameters. For example, in `https://uni4all.servehttp.com/calendar?eventWishlist=summary` in the returned events parameters only the event summary is present (has the response follows the request parameters). [Here](https://github.com/FEUP-ASSO-2021-22/uni4all/blob/e7cfa9dbe56fd823a154d18ee7881e21ac050b22/api/src/controller/calendar.controller.ts#L357) is the function where we validate the incoming wish templates.

**Consequences**:
- Pros:
    - Allows for better personalization of each request, meeting user needs and avoids the overhead in the retrieval and transfer of information that they don't need.
- Cons:
    - Can become unnecessarily complex in case of simple use cases.
    - Extra parameters in the request url may confuse novice users.

---

### Atomic Parameter

_Microservice API Pattern_

[Pattern URL](https://microservice-api-patterns.org/patterns/structure/representationElements/AtomicParameter)

**Context**: We want to offer the ability to delete and update calendar events to API clients using an API endpoint. To enable the communication, they need to agree on the structure of each message (i.e., the request message and response message of the Operation) to be exchanged.

**Mapping**: To delete or update a certain event the user should send a DELETE or PUT request to the following route `/calendar/event/:id` where the `id` is the agreed structure to represent a resource in the database. Here are the code lines where the pattern is present: [delete](https://github.com/FEUP-ASSO-2021-22/uni4all/blob/e7cfa9dbe56fd823a154d18ee7881e21ac050b22/api/src/routes/calendar.ts#L249) and [update](https://github.com/FEUP-ASSO-2021-22/uni4all/blob/e7cfa9dbe56fd823a154d18ee7881e21ac050b22/api/src/routes/calendar.ts#L356).

**Consequences**: 
- Pros:
    - With this representation there is no doubt on how to identify the resources to be deleted or updated.
- Cons:
    - The implementation of this pattern provides no flexibility in case additional data needs to be transmitted with the message (like security information).

---

### Atomic Parameter List

_Microservice API Pattern_

[Pattern URL](https://microservice-api-patterns.org/patterns/structure/representationElements/AtomicParameterList)

**Context**: Since we want to offer the possibility of updating the custom calendar events to API clients using an API endpoint. To enable the communication, the structure of each message and the list of parameters to be exchanged is agreed on previously.

**Mapping**: To update a certain event the user should send a PUT request to the following route `/calendar/event/:id` where the `id` is the agreed structure to represent a resource in the database. The user should also include in the **request body** the list of parameters to update and the respective values. [Here](https://github.com/FEUP-ASSO-2021-22/uni4all/blob/e7cfa9dbe56fd823a154d18ee7881e21ac050b22/api/src/routes/calendar.ts#L356) is the specification of the list of parameters to be updated.

**Consequences**:
- Pros:
    - With this representation there is no doubt about which are the parameters to update.

---

### Adapter Microservice
_Cloud Adoption Pattern_

[Pattern URL](https://kgb1001001.github.io/cloudadoptionpatterns/Microservices/Adapter-Microservice/)

**Context**: We have a scraping component with two different endpoints regarding calendar events: one that returns a student's timetable (event type TIMETABLE - from SIGARRA) and another that returns a student's exams (event type EXAM - from SIGARRA). We also have a functionality that returns a student's custom events (events that were created by him - other endpoints are in charge of letting the user manipulate them). We would like a student to be able to obtain all of his events with a single unified and flexible interface.

**Mapping**: We implemented an Adapter Microservice. This service provides an abstraction to all of the preexisting functionalities/interfaces that essentially vary by each type of event (CUSTOM, EXAM and TIMETABLE), and does so by adapting the interface from the two scraping endpoints to a unified interface that answers to all of a user's needs regarding calendar events. [Here](https://github.com/FEUP-ASSO-2021-22/uni4all/blob/main/api/src/controller/calendar.controller.ts) is the file where the service is implemented.

**Consequences**:
- Pros:
    - Users need only one request to obtain all the types of events that are available in the calendar service.
    - With the application of the WishList API pattern, as described [above](#Wish-List), an user can choose any combination of event types that he wishes to receive.
- Cons:
    - This service's functionality and quality depends on the scraping services'.

---

### Results Cache
_Cloud Adoption Pattern_

[Pattern URL](https://kgb1001001.github.io/cloudadoptionpatterns/Microservices/Results-Cache/)

**Context**: We get timetable and exams event data by scraping from SIGARRA. As this is a time and resource consuming task, both on our end and on SIGARRA's end, we should have a way of keeping older results for a certain amount of time before they expire, so that repeated requests can benefit from the same data.

**Mapping**: To solve this issue, we use the Results Cache pattern. We store the results of previous calls to the scraping service in the database. Then we retrieve them in subsequent calls while the stored data is considered valid (e.g. the data could be considered valid for a day after being obtained). [Here](https://github.com/FEUP-ASSO-2021-22/uni4all/blob/a4567403bb2927143e97050c91aa2aba4e61c4e3/api/src/controller/calendar.controller.ts#L151) is the piece of code where the cache is updated.

![](https://i.imgur.com/y0Zwrql.jpg)

**Consequences**:
- Pros:
    - We reduce the overhead from scraping data from SIGARRA in repeated calls.
- Cons:
    - The cached data can become inconsistent with the data in SIGARRA between cache updates.

---

### Updating the cached data

Two possible architectures were taken into consideration:

- define a scheduler to generate **events** to update the calendar stored in a cache. This would be essential in an [Event-based Architecture](https://kgb1001001.github.io/cloudadoptionpatterns/Event-Based-Architecture/README/) where periodically an event is generated, which triggers a call to the scraping service and updates the events associated with the current user.
    - Advantage:  
        - the data is periodically updated.
    - Disadvantage:
        - this would force to define a scheduler for each student or make calls for all students periodically.
        - this would happen even if a student didn't hasn't requested data for a while.

- **ADOPTED SOLUTION**: on each get request (that requests timetable or exams events) check when was the last time that the data in the cache was updated. If the time that has passed since then is greater than a certain defined threshold (e.g. 1 day), then update the cache and return the response. Otherwise, return the data in the cache. [Here](https://github.com/FEUP-ASSO-2021-22/uni4all/blob/a4567403bb2927143e97050c91aa2aba4e61c4e3/api/src/controller/calendar.controller.ts#L151) is the piece of code where the cache is updated.
    - Advantage:
        - the data will be as well updated as in the previous solution.
    - Disadvantage:
        - the first request after the defined cache lifetime will take a little longer because the data is going to be scraped from SIGARRA.
    - We adopted this solution because the **trade-off** between the overhead in, for example, if the cache lifetime is 1 day, *every day scraping every student's data from SIGARRA* vs the *longer waiting time when the user makes his first request* in a while seemed worth it and would reduce the load on SIGARRA and on our service.

## API Endpoints

In this section we describe the API endpoints that were implemented, along with the Microservice API Patterns we used. We can also consult our [OpenAPI documentation](https://uni4all.servehttp.com/api-docs/#/Calendar).

### GET `/calendar`

This was shared with `T2G4` and more detailed API specification can be found at [their calendar documentation](./t2g4-calendar.md).

Our focus was mainly to integrate events from SIGARRA with the custom user events that follow the previously described architecture and design.

#### Patterns

- [Wish List](#wish-list)
- [Wish Template](#wish-template)

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
- [Atomic Parameter](#atomic-parameter)
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
- [Wish List](#wish-list)
- [Atomic Parameter List](#atomic-parameter-list)

## Future considerations

**Cloud Adoption Patterns**

By scaling in the amount of users, we could implement a stronger [Microservices Architecture](https://kgb1001001.github.io/cloudadoptionpatterns/Microservices/Microservices-Architecture/), which would be easier to scale, for example by replicating in-demand services. With this, we could also take advantage of [Polyglot Development](https://kgb1001001.github.io/cloudadoptionpatterns/Microservices/Polyglot-Development/), for example, for using Python for scraping from SIGARRA.

**Microservice API patterns**

[Backend Integration](https://microservice-api-patterns.org/patterns/foundation/BackendIntegration) - with the adoption of microservices, we could specify the communication between two or more backends ([Solution Internal API](https://microservice-api-patterns.org/patterns/foundation/SolutionInternalAPI)), being it message-based or event-driven.

As said in more detail during the API endpoints specification above, we could improve the user's interaction with the API by implementing, in the endpoints where it is appropriate, the [Conditional Request](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/ConditionalRequest) (could be integrated, for example, to only return the requested data if the data hasn't changed since the user's last request, especially useful for SIGARRA data) and [Request Bundle](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/RequestBundle) (could be integrated allowing efficient mass deletion and update of events into a single request) patterns.
