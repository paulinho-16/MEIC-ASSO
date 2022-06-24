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

As we've seen before, our scraping component faces a problem from the start: access to resources that require authentication is impossible without an ad-hoc solution that is possibly insecure, as mentioned in the authentication component documentation.

From the moment the authentication problem arose, we realized that it would be necessary to implement a component that would monitor the communication between the Flutter App and the Node.js backend, to avoid chaotic dependencies between objects.

#### Mapping

The architecture for this pattern is described in the second flow diagram presented above.

#### Consequences

##### Pros

- *Single Responsibility Principle*: extract the communications between various components into a single place, making it easier to comprehend and maintain.
- *Open/Closed Principle*: introduce new mediators without having to change the actual components
- Reduction of coupling between various components of a program
- Reuse individual components more easily

##### Cons

- Over time a mediator can evolve into a **God Object** - an object that references a large number of distinct types, has too many unrelated or uncategorized methods, or some combination of both.

##### Note

- This pattern is half implemented, as we have started to develop the basic structure of this component, having managed to integrate services that do not require authentication. In the future, it will also be necessary to integrate services that require authentication, using modules developed by the group responsible for the Authentication component.

### Flutter Facade

#### Context

Interaction with our API requires some internal knowledge of the system which is undesirable to clients. A facade is a good solution to simplify interaction with the API.

#### Mapping

To ensure that frontend developers don't need to interact directly with our API, we provided a simplified facade with methods for each HTTP operation that internally deals with response logic of our API. This removes complexity that isn't of the client's responsibility, i.e. the user of the facade is not concerned with response codes or whether the operations require authentication.

#### Consequences

##### Pros

- Simplified interface to interact with the API on the client side
- Isolation of the code from the complexity of a subsystem

##### Cons

- Can also become a **God Object** coupled to all classes of an app
- If you wanted to use our API outside the Flutter app, you would need to create another Facade in another environment
- In our specific situation, the facade can be a too generic and may require the client to further implement methods on top of the facade to reduce the logic even more

##### Note

### Results Cache

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



## Scraping of Sigarra's protected pages

**Target Audience**:
Developers/Teams that need to perform scraping of a page that needs the User to be authenticated *e.g.* scraping the schedule

**Request's Flow**:
- The authentication in Sigarra is made on the client-side by directly making the authentication POST request to sigarra's URL with the password and username as parameters of the request body or using a session token - *so you don't need to worry about this step*;
- When the user wants to access a service that requires authentication, it makes a request to the endpoint of our API that is responsible for returning as a response the URL that contains the requested information;
    > *e.g.* If the user wants to access his profile then he must access the URL `https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=<up_identifier>`
- At the client-side, a request will be sent to the URL that we provided. That request will return the HTML of the page, which must be sent to the endpoint of our API that performs the scraping of the HTML and returns the processed data;
    > *e.g.* The HTML that is returned by the request made to the URL of Sigarra that contains the schedule is received in the endpoint that is responsible for scraping that information. The schedule data must be returned as response to the request

**Endpoints**:
At least two endpoints are required if you must do the scraping of a page that required authentication:
1. Returns the URL of Sigarra that contains the information that you need to scrape;
2. Receives the HTML of the page that contains the data, performs the scraping and returns the processed information.

**Additional Notes**:
- The access to most of the User's confidential data requires a special user id (`pv_fest_id`). Therefore, the teams may need to get this id before performing the steps described above. This can be done by requesting the front-end to provide the HTML of the profile page of the User:`https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=<up_identifier>`. The `pv_fest_id` is available in the link to the Academic pathway. Other ways to get this id are probably available. After getting this id, the server may proceed normally with the steps descriped above by adding this query parameter.

## References

- [Refactoring Guru]
    - https://refactoring.guru/design-patterns/mediator
    - https://refactoring.guru/design-patterns/facade
