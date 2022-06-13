# uni4all

Welcome to the repository supporting the development of the uni4all project, developed as part of the practical classes of the FEUP/M.EIC/ASSO/2021-22 course.

## Contents

* [Product envisioning](#product-envisioning)
* [High-level architecture](#high-level-architecture)
* [Technologies](#technologies)
* [Design and architecture](#design-and-architecture)
* [Operation](#operation)
* [Usage](#usage)
* [Contributing](#contributing)


## Product envisioning    

### Vision

The product intends to improve the uni4all app developed by NIAEFEUP. It will provide features such as authentication, scraping, an integrated chat, calendar and jobs, payments, notifications, group making, feedback and registrations. In terms of non-functional requirements it is of relevance performance, operating and lifecycle quality.

### Themes

- Car sharing
- Authentication
- User profiles
- Meals
    - Cantine
    - Bares
    - Grill
    - SASUP
- Schedule management
    - Algorithm to optimize schedule, synchronization
    - Exams schedule
    - Other events
    - Personal schedule
    - Services (e.g. Library schedule)
- FEUP Classrooms
- Group formation - project groups, study groups and class
- Library
    - Book reservation (and delivery dates)
    - Capacity
    - Classrooms
- External systems
    - GPS systems (e.g. study places)
    - Housing
    - External places to eat (together with meals)
- Scheduling appointments
    - Psychologist
- Registering for stuff: Pick classes, UCs, register for 2nd call exams
- Presence in practical classes
- Feedback (about everything)
    - Trouble tickets
- News
- Job listings management
- Printing system
- Appliances system (Projeto Integrador)
- Student Associations
- Chat (class groups)
- Notifications
    - Calendar (deliveries, exams, tests...)
- Queues / Crowd Sourcing
- Mentoring app (Erasmus students also)
- Accio with comments
- Payments (Balance)

### Quality attributes


There are a few quality attributes defined for this project:
* **performance quality** - the system needs to be reliable, secure and with a relatively small response time;
* **operating quality** - the system needs to be available and scalable;
* **lifecycle quality** - the system should be maintainable and portable.



### Challenges and foreseen possible solutions

#### Data Storage

- Chats need lots of small writes and reads
- Scalability
    - group formation deals with multiple degrees, multiple courses and multiple groups
- Performance
    - there are multiple group types: study, projects, etc; the algorithms that form these groups need to be fast

**Patterns**: Shared repository

### Privacy
- Avoid storing user data
- Handle user data carefully (encryption, etc)
- Authentication (handling of user credentials)

**Patterns**: None

### Efficiency when dealing with scrapped data

- Scraping on demand can be slow
    - e.g. user profiles: information can be scrapped once a day, and the user can force refresh, an action that triggers a new scrapping
- Scrap periodically and store data in a server (outdated data and privacy concerns)

**Patterns**: (something related to caching)

### Data combination from different sources

- How should data submitted by users be combined with scrapped data

**Examples**: personal calendars have information that comes from different Sigarra pages, endpoints, and possibly external services

**Patterns**: Shared repository, Microkernel

### Real-time communication in chats

- Delay can be hard to deal with
- Some users might not be online at the time the messages are created

**Patterns**: Broker, Publisher-Subscriber

### Security in payments

- Use third-party APIs

**Patterns**: None

### Versatility and ability to add modules

- The project needs support for lots of modules with different functionalities
- The modules should be independent of one another, allowing them to be enabled or disabled without affecting the ones in production
- There is the possibility of having multiple instances of some modules (for example, if there are 2 front-ends with the same functionality, we should have 2 instances of the database)

**Patterns**: Microkernel, [Module](https://en.wikipedia.org/wiki/Module_pattern)

### Notifications

- Most of the applications will need to use a notification/alert system to give users relevant information (for example, chat notifications, car-sharing notifications, Sigarra notifications, etc.)
- We have 2 problems:
    1. **Notifications** - sent in real-time, similar to the real-time communication in chats problem
    2. **Alert** - sent at a reasonable time that would be most effective to your users (for example, some type of notifications will only be sent at some specific hour, taking into account the user's local timezone)
- The user should be able to **subscribe** to what type of information wishes to be notified about, based on their preferences.

**Patterns**: Publisher-Subscriber

### How to design the API

**Foundation**

- Support multiple client-side user interfaces while keeping these decoupled from the backend server-side implementation
    - [Frontend Integration](https://microservice-api-patterns.org/patterns/foundation/FrontendIntegration)
- Clients need to know how to call the API in precise terms
    - [API Description](https://microservice-api-patterns.org/patterns/foundation/APIDescription)
- The visibility of the new API should be restricted
    - [Community API](https://microservice-api-patterns.org/patterns/foundation/CommunityAPI)
    - [Solution-Internal API](https://microservice-api-patterns.org/patterns/foundation/SolutionInternalAPI)

**Responsibility**

- Provide CRUD functionality
    - [Information Holder Resource](https://microservice-api-patterns.org/patterns/responsibility/endpointRoles/InformationHolderResource)
        - map each endpoint to an entity (and expose CRUD operations over that entity)
- Retrieve information from a service provider
    - [Retrieval Operation](https://microservice-api-patterns.org/patterns/responsibility/operationResponsibilities/RetrievalOperation)
- Let clients exchange data
    - [Data Transfer Resource](https://microservice-api-patterns.org/patterns/responsibility/informationHolderEndpointTypes/DataTransferResource)
- Provide an endpoint to access static data
    - [Reference Data Holder](https://microservice-api-patterns.org/patterns/responsibility/informationHolderEndpointTypes/ReferenceDataHolder.html)

**Structure**

- Provide a structure for the messages exchanged between client and server
    - [Atomic Parameter](https://microservice-api-patterns.org/patterns/structure/representationElements/AtomicParameter)
    - [Atomic Parameter List](https://microservice-api-patterns.org/patterns/structure/representationElements/AtomicParameterList)
- Help clients to not having to load all the information in a single response
    - [Pagination](https://microservice-api-patterns.org/patterns/structure/compositeRepresentations/Pagination)

**Quality**

- Handle authentication of different clients
    - [API Key](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/APIKey)
- Prevent unnecessary server-side processing and bandwidth
    - [Conditional Request](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/ConditionalRequest)
    - [Request Bundle](https://microservice-api-patterns.org/patterns/quality/dataTransferParsimony/RequestBundle)
- Inform clients about the errors
    - [Error Report](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/ErrorReport)

**Evolution**

- New versions with improved functionality are offered over time
    - [Version Identifier](https://microservice-api-patterns.org/patterns/evolution/VersionIdentifier)
- Maintain several versions of API endpoints and their operations
    - [Two in Production](https://microservice-api-patterns.org/patterns/evolution/TwoInProduction)


## High-level architecture

_Instructions: Information about **Components**, **Activities** and **Infrastructure** (respectively, use UML Component, Activity and Deployment diagrams. Provide higher-level views over these three types of elements using _Package_ diagrams, if appropriate._

### Components

- **T1G4** Scraping
- **T2G1** Authentication
- **T1G3** [Chat](./chat.md)
- **T1G2** Jobs
- **T1G1** [Payments](./payments.md)
- Notifications
- External API / Services
- [Calendar](./calendar.md)
    - **T2G4**
    - **T1G2**
- **T2G5** Group Making
- **T2G2** Feedback
    - canteen/bar meals (reviews)
    - classes/professors (reviews)
    - pedagogical surveys
- Registrations

## Technologies

### Backend Framework

- Node.js
    - **Express ✔**
        - Can integrate with swagger using [swagger-node-express](https://www.npmjs.com/package/swagger-node-express) ❌ or [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) ✔️.
        - Can integrate with [passport](https://www.npmjs.com/package/passport) ❓ (to be studied).
    - Sails
    - Meteor
    - Loopback
    - Cheerio
    - Axios
    - Puppeteer
    - Playwright
    - nodemailer: to send the password recover email
    - Socket.IO: enables real-time, bi-directional communication between web clients and servers
    - [mongoose](https://mongoosejs.com/): an ODM library for MongoDB and Node 
- Python
    - If microservices are added in the future
    - [beautifulsoup4](https://pypi.org/project/beautifulsoup4/)
    - [selenium](https://www.selenium.dev/)

### Development Environment

- TypeScript
- EsLint
- Docker
    - Reverse proxy for cache
        - Apache
        - nginx

### Database

- redis: for session storage
- postgres: to store the credentials (email and password) of the user
    - Cache
- MongoDB
    - Default
    - Information on Sigarra is not structured
    - New structured data may grow fast



## Design and architecture

_Instructions: Document design and architecture problems and solutions, preferably using pattern instances. Justify all design and architectural choices, preferably based on operational data.<br><br>
Documenting pattern instances is important because it will help other developers
to better understand the resulting concrete classes, attributes and methods,
and the underneath design decisions. <br>
This provides a level of abstraction higher than the class/component level,
highlighting the commonalities of the system and thus promoting the understandability,
conciseness and consistency of the documentation.  <br>
At the same time, the documentation of pattern instances will help the designer instantiating a pattern,
to certify himself that he is taking the right decision.  <br>
In general terms, this results in better communication within the development team, and consequently on less bugs.
To more formally document a pattern instance we must describe the design context, to justify the selection of the
pattern, to explain how the pattern roles, operations and associations were mapped to the concrete design classes,
and to state the benefits and liabilities of instantiating the pattern, eventually in comparison with other alternatives.<br><br>
It is expected that you start this section with system-wide patterns, but you should link to component-specific pages for describing the design of individual components. <ins>For each pattern instance</ins> that you would like to document, use the following template:_

### _name the goal that you would like to achieve, or problem to solve_

**Context**: _Describe the design context that justifies the selection of the pattern. Link to your best reference of the pattern, if available._

**Mapping**: _Explain how are mapped the pattern's roles, operations and associations to the concrete design classes. Something that works well is to annotate UML structural diagrams with pattern roles, as is done in  [JUnit A Cook's Tour](http://junit.sourceforge.net/doc/cookstour/cookstour.htm), for example. Link to the appropriate files in the repository._

**Consequences**: _Explain the pros and cons of instantiating the pattern, eventually in comparison with other alternatives._

### Access Token

#### Context

Our application makes use of a Microservices architecture and therefore, there are multiple services that must authenticate the User to verify his identity and authorize the access to specific resources. In order to provide a single interface that can be reused by each of the services, the Access Token pattern is used to authenticate the user.


#### Mapping

![](https://i.imgur.com/c3rHVIS.png)

Based on this diagram, the Flutter App would be the client, which would send an Access Token to the API endpoints that require authentication or authorization. Our Authentication service, in particular the middleware, intercepts the requests to verify if the user is authenticated and authorized to access the resource.

#### Consequences

##### Pros

- Higher scalability and efficiency: access tokens are not stored on the server;
- Flexibility: offers authentication and authorization for several applications or services;
- Robust security: a secret key is required to generate and validate the token;
- Usability: the user doesn't need to authenticate at every request, he just needs to send the access token.

##### Cons

- Compromised access token: if the secret key or token are not stored correctly, security can be compromised;
- Data overhead: the access token is usually bigger than a normal session token;
- Shorter lifespan: access tokens have a short lifespan which could lead to a worse UX.

### API Key

#### Context

Some of the services offered by our API will return different data depending on the user trying to access it, therefore we need a way to identify and authenticate users.

#### Mapping

![](https://i.imgur.com/zVXqqR0.png)

Based on this diagram, the client is the Flutter App, which requires authentication to obtain certain information. Our backend offers the API that receives the token.

#### Consequences

##### Pros

- Security: The token makes the service more secure by allowing us to identify the user.

##### Cons

- Sending the token in every request increases the network traffic.

### Error Report

#### Context

Our app services need to handle errors generated at runtime. To achieve this, our error messages have to follow a specific design that everyone agreed on.

#### Mapping

![](https://i.imgur.com/69C1ZxW.png)

The image represents what an error message would be like in the context of our application.

#### Consequences

##### Pros

- Error messages allow the end user to understand what generated the error in a simplistic way;
- Having a detailed report of the error may help achieve a solution.

##### Cons

- Having a very detailed explanation may expose sensitive data and other details related to provider side implementation.

### Client Session State

#### Context

When exchanging information with a client, our server needs to be able to keep state information. Because HTTP is a stateless protocol, we need to use tokens to be able to improve the user experience, allowing a client to stay logged in without having to keep sending their credentials. In our case, the token will be sent in the Authorization Header.

#### Mapping

![](https://i.imgur.com/KfzTZcm.png)

#### Consequences

##### Pros

- Low Latency: validating and creating sessions is faster as it doesn't need to consult the database;
- Increases usability for the user;
- Supports stateless server objects with maximal clustering and failover resiliency.

##### Cons

- Sessions cannot be terminated (even though there are workarounds);
- Logout is not possible: the session token can be dropped from the browser (in case of a cookie) or from storage, but it would still work if resubmitted, unless other workarounds are used to avoid that (which is the case).
- Performance burden due to encryption and decryption in each request.

### Saving User Login Information

#### Context

Jwt tokens are sent as a response to login requests, but these tokens have a specified lifetime. A priori, we have no way to invalidate it before it expires, which is necessary when the user wants to logout.

#### Mapping

We can save the session information in a database when the user logs in and remove it on logout. However, this implies a verification of each request containing tokens, and that's why a cache database like Redis is better for this purpose.

#### Consequences

##### Pros

- We have a way to check if the tokens are active
- We can invalidate tokens, so that people cannot use them anymore, which is needed for the logout functionality

##### Cons

- We need to establish connections to the database in every authenticated request, to validate the token
- The overhead can be mitigated by using a cache database, but it is still there either way

### Sigarra's Authentication

**Context**:
Some of the functionalitites that Uni4all provides, such as the access to the schedule or classes, require the User to be authenticated in Sigarra. However, Sigarra does not provide any means to authenticate via an API or OAuth.

For security reasons, we decided that our server should not receive Sigarra's credentials at any point. This way, if there is a crash on our Server, it won't compromise Sigarra's credentials.

The requests for pages that require authentication will be sent on the client-side directly to Sigarra. Sigarra will reply with the HTML of the requested page, which should be forwarded to the endpoint of our server that performs the scrapping of the respective HTML and returns the processed information.
> Further details on how to proceed if you need to perform scraping of a page that requires Sigarra's authentication are available in the *Contributing* section under the subtitle [Scraping of Sigarra's protected pages](#Scraping-of-Sigarras-protected-pages) .

**Mapping**:
> N/A: This solution does not map to a pattern

**Consequences**:
**Pros**:
- Security: By adopting this solution, the credentials will only be sent to our server. Therefore, a crash or attack to our server will not reveal sensitive information that could indirectly affect Sigarra.

**Cons**:
- Latency: the number of requests/responses leads to an increase in latency.

### Groups Making

For Design and Arquitecture documentation related to the **Groups Making** module, please refer to this [document](./groupMaking.md).


## Operation

_Instructions: Information about how to set up a production environment, how to build and package the system for deployment, how to deploy the system to production, how to operate the system (where the logs are, how to access monitoring tools, etc.), and how to run and access architectural fitness functions and use them to decide (or not) to the intended quality attributes._

## Usage

_Instructions: Information about how the product can be used from the standpoint of its users (e.g., API endpoints and how to use them). The API documention should be usable, accurate and up-to-date._

Information about the usage of the product can be found at the following link:

- [uni4all.servehttp.com/api-docs/](https://uni4all.servehttp.com/api-docs/)

It includes all the API endpoins and respective usages.

## Contributing

_Instructions: Information about setting up the development environment, running the system in development, running the tests. Also, should include documentation on all the API endpoints (including internal ones) and how to use them. The API documention should be usable, accurate and up-to-date.

### Scraping of Sigarra's protected pages

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

### Authentication Middleware
#### Context - How are we authenticating the user?
In order to authenticate the user we use JWT tokens. This tokens are sent to the user upon a successful login both in the response and in a cookie. The JWT token must then be sent in every request that requires authentication and authorization. For that, the request may send the **cookie** or it can set the **Bearer Token in the Authorization header**.

#### Usage of the Authentication Middleware
If a service needs to authenticate the user before providing access to a resource, it can use the **authentication middleware** to do so, particularly the `verifySessionToken` middleware function.
You just need to define your route like the one below, setting the first and third parameters with the appropriate path and handler:
```typescript=
import auth from '@/middleware/auth'
router.get(PATH, auth.verifySessionToken, HANDLER)`
```
If you need to know who is accessing your endpoint, you can access the id of the user, which will be set by our middleware in the request body (`req.body.id`).

In the file that contains the authentication routes, you can find an example route (`testAuth`), which returns as a response the id of the user if a valid access token is provided. Otherwise, an error message will be returned.
