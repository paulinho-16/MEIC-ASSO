# uni4all

Welcome to the repository supporting the development of the uni4all project, developed as part of the practical classes of the FEUP/M.EIC/ASSO/2021-22 course.

## Product

Use this section to provide a high-level view over what the product intends to provide in terms of function and non-functional requirements. These high-level requirements will later be broken up and documented as user stories.

## Vision

## Product Themes

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
    - GPS systems (e.g. study places)
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

## Endpoints TBD

**Turma 1**

- Cantine / Menus
- Library current capacity
- News
- Jobs

**Turma 2**

- Student Associations
- Group formation - project groups, study groups and class
- Feedback

## Quality attributes

This section should give an idea of the high-level non-functional requirements.

## Challenges and foreseen possible solutions

This section is responsible for identifying architectural and design challenges, as well as the solutions that we foresee may be useful to address them. Many of these solutions can (and should) be expressed as architectural patterns.

### Data Storage

**Definition**
- Chats need lots of small writes and reads
- Scalability
    - group formation deals with multiple degrees, multiple courses and multiple groups
- Performance
    - there are multiple group types: study, projects, etc; the algorithms that form these groups need to be fast

**Patterns**
- Shared repository

### Privacy

**Definition**
- Avoid storing user data
- Handle user data carefully (encryption, etc)
- Authentication (handling of user credentials)

**Patterns**
- None

### Efficiency when dealing with scrapped data

**Definition**
- Scraping on demand can be slow
    - e.g. user profiles: information can be scrapped once a day, and user can force refresh, action that triggers a new scrapping
- Scrap periodically and store data in a server (outdated data and privacy concerns)

**Patterns**
- (something related with caching)

### Data combination from different sources

**Definition**
- How should data submitted by user be combined with scrapped data

**Examples**
- calendar
    - personal calendars have information that come from different Sigarra pages, endpoints, and possibly external services

**Patterns**
- Shared repository
- Microkernel **why? :(**

### Real-time communication in chats

**Definition**
- Delay can be hard to deal with
- Some users might not be online at the time the messages are created

**Patterns**
- Broker
- Publisher-Subscriber

### Multiple authentication strategies

(**what does this mean? we need Sigarra credentials anyway**)

**Definition**
- None

**Patterns**
- None

### Security in payments

**Definition**
- Use third-party APIs

**Patterns**
- None

### Versatility and ability to add modules

**Definition**
- The project needs support for lots of modules with different functionalities
- The modules should be independent of one another, allowing them to be enabled or disabled without affecting the ones in production
- There is the possibility of having multiple instances of some modules (for example, if there are 2 front-ends with the same functionality, we should have 2 instances of the database)

**Patterns**
- Microkernel
- Module ([see description](https://en.wikipedia.org/wiki/Module_pattern))

### Notifications

**Definition**
- Most of the applications will need to use a notification/alert system to give users relevant information (for example, chat notifications, car sharing notifications, Sigarra notifications, etc.)
- We have 2 problems:
    1. **Notifications** - sent in real-time, similar to the the real-time communication in chats problem
    2. **Alert** - sent at a reasonable time that would be most effective to your users (for example, some type of notifications will only be sent at some specific hour, taking into account the user's local timezone)
- The user should be able to **subscribe** to what type of information wishes to be notified about, based on their preferences.

**Patterns**
- Publisher-Subscriber

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
- ??
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

## Components

- Scraping
- Authentication
- Chat
- Calendar
- Payments
- Notifications
- External API / Services
- Group Making
- Feedback
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
- Python
    - If microservices are added in the future
    - Scrapping

["The Best NodeJS Frameworks for 2021"](https://rapidapi.com/blog/best-nodejs-frameworks/)
![](https://i.imgur.com/NrBnTJj.png)

### Miscellaneous

- TypeScript
- EsLint
- Docker
    - Reverse proxy for cache
        - Apache
        - nginx

### Database

- PostgreSQL or MariaDB
- Redis
    - Cache
- **MongoDB**
    - Default
    - Information on Sigarra is not structured
    - New structured data may grow fast
- Neo4j

### Scrapping

- Node.js
    - Cheerio + axios
    - Puppeteer
    - Playwright
- Python
    - [beautifulsoup4](https://pypi.org/project/beautifulsoup4/)
    - [selenium](https://www.selenium.dev/)

## Logical architecture

Document the high-level logical structure of the system, using a UML diagram with logical packages, without the worry of allocating to components, processes or machines.

It can be beneficial to present the system both in a horizontal and vertical decomposition:

- Horizontal decomposition may define layers and implementation concepts, such as the user interface, business logic and concepts.
- Vertical decomposition can define a hierarchy of subsystems that cover all layers of implementation.

## Physical architecture

Document the high-level physical structure of the software system (machines, connections, software components installed, and their dependencies) using UML deployment diagrams or component diagrams (separate or integrated), showing the physical structure of the system.

It should also describe the technologies considered and justify the selections made. 

## Development

Include here instructions for ...
- setting up the development environment
- running the system in the development environment
- running the tests

## Operation

Include here instructions for ...
- setting up a production environment
- building and packaging the system for deployment
- deployment the system to production
- operating the system (where the logs are, what monitoring tools are in place, etc.)


## Other information

Things will break. Deal with it, together.
