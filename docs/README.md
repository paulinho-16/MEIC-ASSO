# uni4all

Welcome to the repository supporting the development of the backend for the uni4all project, developed as part of the practical classes of the FEUP/M.EIC/ASSO/2021-22 course.

## Contents

* [Product envisioning](#product-envisioning)
* [High-level architecture](#high-level-architecture)
* [Technologies](#technologies)
* [Operation](#operation)
* [Usage](#usage)
* [Contributing](#contributing)


## Product envisioning    

### Vision

The uni4all backend aims to support the uni4all app developed by NIAEFEUP, with several services for authentication, scraping of web pages, integrated chat, calendar and jobs, notifications, groups management, feedback and registrations. In terms of non-functional requirements it is very relevant the performance, operating and lifecycle quality.

### Themes

The services requested by UNI and perceived as highly valuable are numerous and diverse, and can be grouped into the following categories:

* Users, groups, and social: authentication, authorization, user profiles, project groups, study groups and classes, messaging (chat with class groups)
* Time management: schedule optimization, synchronisation, exams schedule, personal schedule, services schedule (e.g. Library schedule), services appointments (e.g. psychologist); calendars
* Classes: assiduity
* Spaces: classrooms, study spaces
* Housing
* Library: book reservation (and delivery dates), capacity, study rooms
* Registering for stuff: pick classes, UCs, register for 2nd call exams
* Trouble tickets, Printing system, News, Job listings management
* Notifications on everything
* Feedback about meals and teachers/classes
* Capacity at each parking lot in FEUP
* Queues from each restaurant/canteen in FEUP
* Eating: cantines, snack-bars, restaurants (Grill, SASUP, others)
* Mentoring app (Erasmus students also)
* Mobility: car sharing;
* Accio with comments

### Quality attributes

There are a few quality attributes defined for the uni4all backend as a whole:
* **performance quality** - the system needs to be reliable, secure and with a relatively small response time;
* **operating quality** - the system needs to be available and scalable;
* **lifecycle quality** - the system should be maintainable and portable.

### Challenges and possible solutions

In concrete, the services to be provided by the backend pose several challenges in terms of: data storage, privacy, efficiency, data interoperability, real-time performance, security, maintainability, evolvability, and extensibility.

In addition, the services will be provided through an API that should be well designed to be concise and easy to extend at the same time.

Each one of these challenges are addressed one by one in the documentation of the respective components.


## High-level architecture

<!--_Instructions: Information about **Components**, **Activities** and **Infrastructure** (respectively, use UML Component, Activity and Deployment diagrams. Provide higher-level views over these three types of elements using _Package_ diagrams, if appropriate._-->

### Components

- [Authentication](./authentication.md), **T2G1**  
This component allows users to register, login, and manage their accounts in uni4all, particularly by updating or recovering the password or even by deleting the account. It also provides a solution for the authorization process that can be used by other components to control the access to certain resources that require the user to be authenticated.
- [Scraping](./scraping.md), **T1G4** , **T1G3** (meals)
- [Chat](./chat.md), **T1G3**  
In the chat component, users can chat with their academic social circles. The main features allow users to view their groups and messages per group, create and join a group and send and receive messages in real time.
- [Payments](./payments.md), **T1G1** 
- [Notifications](./notification.md) **T2G3**
- External API / Services
- Calendar: [T1G2](./t1g2-calendar.md), **T1G2**; [T2G4](./t2g4-calendar.md), **T2G4**; 
- [Group Making](./groupMaking.md), **T2G5** 
- [Feedback](./feedback.md), **T2G2**: canteen/bar meals, classes/teachers
- [Capacity](./capacity.md), **T2G2**: capacity at each parking lot in FEUP
- [Queues](./queues.md), **T2G2**: queues in each canteen/bar at FEUP
- [Jobs](./jobs.md), **T1G2** 
- Registrations

## Technologies
For the implementation of all the services, several technologies were used, namely: node.js and several libraries, python, redis, postgres, mongodb, etc.



## Operation

<!--_Instructions: Information about how to set up a production environment, how to build and package the system for deployment, how to deploy the system to production, how to operate the system (where the logs are, how to access monitoring tools, etc.), and how to run and access architectural fitness functions and use them to decide (or not) to the intended quality attributes._-->

### Monitoring

To add new hosts and endpoints to be monitored you can either extend the `uni4all.cfg` configuration file with new services or create a new one. If you create a new configuration file you need to update the `nagios.cfg` file with its path as exemplified for the `uni4all.cfg` and `monitoring.cfg` files.

The Naxios-based monitoring was set up and initially configured by group **T1G2**. It was then passed to João Araújo.

#### How to run

```
cd monitoring
docker build -t asso-monitoring .
docker run -p 80:80 asso-monitoring
```

#### How to access

```
locally: http://localhost:80/nagios/

production: http://34.125.159.222/nagios/

username: nagiosadmin
password: jv=M-%#vx:KKpW_)7<*5
```

### Project

#### How to run

The project can be built and deployed with docker.

```
docker-compose build
docker-compose up
```

## Usage

<!--_Instructions: Information about how the product can be used from the standpoint of its users (e.g., API endpoints and how to use them). The API documention should be usable, accurate and up-to-date._-->

The product is available at:

- [uni4all.servehttp.com/](https://uni4all.servehttp.com/)

At the endpoint [/status](https://uni4all.servehttp.com/status) is available the process uptime.

Information about the usage of the product can be found at the following link:

- [uni4all.servehttp.com/api-docs/](https://uni4all.servehttp.com/api-docs/)

It includes all the API endpoints and respective usages.

## Contributing

<!--_Instructions: Information about setting up the development environment, running the system in development, running the tests. Also, should include documentation on all the API endpoints (including internal ones) and how to use them. The API documention should be usable, accurate and up-to-date.-->

Information about the API endpoints can be found at the following link:

- [uni4all.servehttp.com/api-docs/](https://uni4all.servehttp.com/api-docs/)

### Setting up the development environment

```
docker-compose -f docker-compose.dev build
docker-compose -f docker-compose.dev up
```





# -----------------
# Text to be refactored up in the file or to be moved to specific component files

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

<!--
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
- postgres: 
    - Credentials (email and password) of the user
    - User calendar events
    - Cache
    - Groups
- MongoDB
    - Default
    - Information on Sigarra is not structured
    - New structured data may grow fast



## Design and architecture

<!--_Instructions: Document design and architecture problems and solutions, preferably using pattern instances. Justify all design and architectural choices, preferably based on operational data.<br><br>
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
It is expected that you start this section with system-wide patterns, but you should link to component-specific pages for describing the design of individual components. <ins>For each pattern instance</ins> that you would like to document, use the following template:_-->

<!--### _name the goal that you would like to achieve, or problem to solve_

**Context**: _Describe the design context that justifies the selection of the pattern. Link to your best reference of the pattern, if available._

**Mapping**: _Explain how the pattern's roles are mapped, operations and associations to the concrete design classes. Something that works well is to annotate UML structural diagrams with pattern roles, as is done in  [JUnit A Cook's Tour](http://junit.sourceforge.net/doc/cookstour/cookstour.htm), for example. Link to the appropriate files in the repository._

**Consequences**: _Explain the pros and cons of instantiating the pattern, eventually in comparison with other alternatives._-->

