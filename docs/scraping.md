# Scraping

## Endpoints

This section provides some context to each of the component's endpoints. For each one of the endpoints, there is a corresponding endpoint, with the format `{endpoint}/URL`. These endpoints are used by the Flutter middleware to get the URL necessary to retrieve the corresponding endpoint information, as the Flutter middleware is responsible for getting the Sigarra HTML pages that require authentication.

#### GET `/associations`

This route returns information about the student associations. It does not require authentication.

#### GET `/curricular_unit/{id}`

This route returns the information of a curricular unit, given its `id`. It requires authentication.

#### GET `/exams-calender/{courseID}`

This route returns the information of the exams calendar, given a `courseID`. It does not require authentication.


#### GET `/grades/{studentNumber}`

This route returns the student grades of the student with the provided student number. It requires authentication.


#### GET `/news`

This route returns the news available on Sigarra. It does not require authentication.

#### GET `/profile/{studentNumber}`

This route returns the personal information associated with the student, given a `studentNumber`. It requires authentication.

#### GET `/schedule/student/{studentNumber}`

This route returns the schedule of a student, given a `studentNumber`. It requires authentication.

#### GET `/services/{serviceNumber}`

This route returns the information for a service, given its `serviceNumber`. It does not require authentication.

#### GET `/student-exams/{studentNumber}`

This route returns the information about the exams of a student, given its `studentNumber`. It does not require authentication.

## Technologies

- Cheerio
    - Cheerio is one of the most popular tools for parsing HTML and XML in Node.js
- Axios
    - Axios is a Javascript library used to make HTTP requests from Node.js
    - It was used to make HTTP requests to the Sigarra, so that Cheerio can scrape the returned HTML
- Flutter and Dart
    - Used to implement the client middleware to communicate between the Flutter app and the Node.js backend

## Flow Diagrams

Since our services are subdivided into two categories (those that need authentication and those that do not), we are faced with two different situations, represented in the following two flow diagrams.


In both cases, the Flutter App starts by asking the Flutter Middleware for the desired service, which then asks the Node.js backend if the service in question needs authentication.

<figure align="center">
  <img src="https://i.imgur.com/WF8nyTo.png"/>
  <figcaption>Figure 1. Flow diagram not requiring authentication.</figcaption>
</figure>

In this simplest case, where authentication is not required (the Node.js backend returns False), the middleware simply asks the service's JSON directly to the API, which, as it does not need authentication, fetches the HTML of the desired Sigarra page, processes it and finally returns the resulting JSON to the middleware, which will forward it to the Flutter App.

<figure align="center">
  <img src="https://i.imgur.com/oIl9byp.png"/>
  <figcaption>Figure 2. Flow diagram requiring authentication.</figcaption>
</figure>

In case the Node.js backend returns True, the middleware first needs to ensure that the Flutter App is authenticated. If so, the middleware asks the backend for the URL of the service in question. After receiving this URL, it fetches the Sigarra page and then requests the desired service from the Node.js backend, at the same time sending the obtained HTML, which will be used for scraping. Finally, after processing this HTML, the backend returns the JSON to the middleware, which forwards it to the Flutter App.

## Patterns

### Mediator Pattern

#### Context
From the moment the authentication problem arose, we realized that it would be necessary to implement a component that would monitor the communication between the Flutter App and the Node.js backend, to avoid chaotic dependencies between objects.

// TODO

#### Mapping

#### Consequences

##### Pros

##### Cons

##### Note

### Flutter Facade

// TODO

#### Context

#### Mapping

#### Consequences

##### Pros

##### Cons

##### Note

### Page Cache

#### Context
Scraping is a task that can sometimes take a lot of time. Furthermore, during a time period, there could be similar requests that require the same scraping task. This problem can be addressed by implementing a cache system, that stores temporarly in fast memory the information returned by the scraping tasks.

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
