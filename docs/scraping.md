# Scraping

## Contents
- [Endpoints](#Endpoints)
    - [Authentication not required](#Authentication-not-required)
    - [Authentication required](#Authentication-required)
- [Technologies](#Technologies)
    - [Cheerio](#Cheerio)
    - [Axios](#Axios)
    - [Flutter and Dart](#Flutter-and-Dart)
- [Design and Architecture](#Design-and-Architecture)
    - [Authentication not required](#Authentication-not-required1)
    - [Authentication required](#Authentication-required1)
- [Patterns](#Patterns)
    - [Mediator Pattern](#Mediator-Pattern)
    - [Flutter Facade](#Flutter-Facade)
    - [Results Cache](#Results-Cache)
- [Components dependency](#Components-dependency)
- [References](#References)

## Endpoints

This section provides some context to each of the component's endpoints. For each one of the endpoints, there is a corresponding endpoint, with the format `{endpoint}/URL`. These endpoints are used by the Flutter middleware to get the URL necessary to retrieve the corresponding endpoint information, as the Flutter middleware is responsible for getting the Sigarra HTML pages that require authentication.

### Authentication not required

#### GET `/associations`

This route returns information about the student associations. 

#### GET `/exams-calender/{courseID}`

This route returns the information of the exams calendar, given a `courseID`.

#### GET `/news`

This route returns the news available on Sigarra.

#### GET `/services/{serviceNumber}`

This route returns the information for a service, given its `serviceNumber`.

#### GET `/student-exams/{studentNumber}`

This route returns the information about the exams of a student, given its `studentNumber`.

### Authentication required

#### GET `/curricular_unit/{id}`

This route returns the information of a curricular unit, given its `id`. 

#### GET `/grades/{studentNumber}`

This route returns the student grades of the student with the provided student number.

#### GET `/major-grades/{pvFestID}`

This route returns the grades of a given student in a given course, with the corresponding pvFestID.

#### GET `/profile/{studentNumber}`

This route returns the personal information associated with the student, given a `studentNumber`.

#### GET `/schedule/student/{studentNumber}`

This route returns the schedule of a student, given a `studentNumber`.

## Technologies

### Cheerio
- Cheerio is one of the most popular tools for parsing HTML and XML in Node.js. 
- We decided to use Cheerio instead of other existing tools for the same end because it is considered fast, flexible, and easy to use by the majority of the users.

### Axios
- Axios is a Javascript library used to make HTTP requests from Node.js
- It was used to make HTTP requests to the Sigarra so that Cheerio can scrape the returned HTML
- By using Axios we remove the need to pass the results of the HTTP request to the ``.json()`` method. Axios already takes care of that for us and simply returns the data object in JSON format. Furthermore, the ``.catch()`` block will automatically be triggered in the event of any HTTP request error. 

### Flutter and Dart
- Used to implement the client middleware to communicate between the Flutter app and the Node.js backend
- We used Flutter and Dart because it was already being used in the original app and we did not want to change the technology.

## Design and Architecture

Since our services are subdivided into two categories (those that need authentication and those that do not), we are faced with two different situations, represented in the following two flow diagrams.

In both cases, the Flutter App starts by asking the Flutter Middleware for the desired service, which then asks the Node.js backend if the service in question needs authentication.

### Authentication not required

<figure align="center">
  <img src="https://i.imgur.com/WF8nyTo.png"/>
  <figcaption>Figure 1. Flow diagram not requiring authentication.</figcaption>
</figure>

In this simplest case, where authentication is not required (the Node.js backend returns False), the middleware simply asks the service's JSON directly to the API, which, as it does not need authentication, fetches the HTML of the desired Sigarra page, processes it and finally returns the resulting JSON to the middleware, which will forward it to the Flutter App.

### Authentication required

<figure align="center">
  <img src="https://i.imgur.com/oIl9byp.png"/>
  <figcaption>Figure 2. Flow diagram requiring authentication.</figcaption>
</figure>

In case the Node.js backend returns True, the middleware first needs to ensure that the Flutter App is authenticated. If so, the middleware asks the backend for the URL of the service in question. After receiving this URL, it fetches the Sigarra page and then requests the desired service from the Node.js backend, at the same time sending the obtained HTML, which will be used for scraping. Finally, after processing this HTML, the backend returns the JSON to the middleware, which forwards it to the Flutter App.

## Patterns

### Mediator Pattern

#### Context

As we've seen before, our scraping component faces a problem from the start: access to resources that require authentication is impossible without an ad-hoc solution that is possibly insecure, as mentioned in the authentication component documentation.

From the moment the authentication problem arose, we realized that it would be necessary to implement a component that would monitor the communication between the Flutter App and the Node.js backend, to avoid chaotic dependencies between objects.

#### Mapping

The architecture for this POSA pattern is described in the second flow diagram presented above, where the Flutter middleware acts as a mediator, controlling the communication between the Flutter App (frontend) and the API backend.

#### Consequences

##### Pros

- *Single Responsibility Principle*: extract the communications between various components into a single place, making it easier to comprehend and maintain.
- *Open/Closed Principle*: introduce new mediators without having to change the actual components
- Reduction of coupling between various components of a program

##### Cons

- Over time a mediator can evolve into a **God Object** - an object that references a large number of distinct types, has too many unrelated or uncategorized methods, or some combination of both.

##### Note

- This pattern has been fully implemented in a Flutter demo App, available on the system's repository.

### Flutter Facade

#### Context

Interaction with our API requires some internal knowledge of the system which is undesirable to clients. A facade is POSA pattern and a good solution to simplify interaction with the API.

#### Mapping

To ensure that frontend developers don't need to interact directly with our API, we provided a simplified facade with methods for each HTTP operation that internally deals with response logic of our API. This removes complexity that isn't of the client's responsibility, i.e. the user of the facade is not concerned with response codes or whether the operations require authentication.

#### Consequences

##### Pros

- Simplified interface to interact with the API on the client side, because clients do not require internal knowledge of the system
- Isolation of the code from the complexity of a subsystem

##### Cons

- Can also become a **God Object** coupled to all classes of an app
- If you wanted to use our API outside the Flutter app, you would need to create another Facade in another environment
- In our specific situation, the facade can be a too generic and may require the client to further implement methods on top of the facade to reduce the logic even more

### Results Cache

#### Context
Scraping is a task that can sometimes take a lot of time. Furthermore, during a time period, there could be similar requests that require the same scraping task. This problem can be addressed by implementing a cache system CAP pattern, that stores temporarly in fast memory the information returned by the scraping tasks.

#### Mapping

<figure align="center">
  <img src="https://i.imgur.com/K4Hiog8.png"/>
  <figcaption>Figure 3. Page cache pattern.</figcaption>
</figure>

As we can see from the diagram, the API starts by checking if the needed resource is available in cache. If it is, the information is returned by Redis. Otherwise, the API needs to fetch the HTML page to scrap from Sigarra, scrap it and store its corresponding information on Redis.

#### Consequences

##### Pros
- Reduction of the time the requests take to be precessed
- Reduction of the network bandwidth
- The system would still temporarily work if the Sigarra component was down

##### Cons
- Increased complexity of the system
- The cache may not be up to date with the Sigarra component

##### Note
- Even though this is one of the more important patterns to implement in this component, it was not implemented due to time limitations. However, it would be a priority in a future development

## Components dependency

### Dependent of scraping
Altough many components are using scraping to complete their features, not all of them are using the scraping implemented by the group T1G4. In this section, we will only describe the components that are being implemented based on the work from group T1G4.

- **Calendar** - in this component it is used both the scraping of the exams of a student and the scraping of the student's schedule to build a calendar

### Scraping is dependent of

- **Authentication** - like it has been mentioned throughout the documentation, the scraping component, for some instances, needs the authentication component to have access to special information.

## References

- [Refactoring Guru - Mediator Pattern](https://refactoring.guru/design-patterns/mediator)
- [Refactoring Guru - Facade Pattern](https://refactoring.guru/design-patterns/facade)
- [CAP - Results Cache Pattern](https://kgb1001001.github.io/cloudadoptionpatterns/Microservices/Results-Cache/)
