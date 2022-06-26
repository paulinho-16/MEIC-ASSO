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

The services to be provided by the backend pose several challenges in terms of: data storage, privacy, efficiency, data interoperability, real-time performance, security, maintainability, evolvability, and extensibility.

Different system components have different quality attributes required to its functioning. While scraping components may need to be reliable, available and with a relatively small response time in order to give a good user experience, other components also need to ensure privacy, for example the chat component or the scraping of authenticated pages. These kind of components either access protected pages or can have sensitive information that should not be disclosured to other people besides the user itself.

Each one of these challenges are addressed one by one in the documentation of the respective components.

There are also a few quality attributes defined for the uni4all backend as a whole, which are:
* **performance quality** - the whole system needs to be reliable, secure and with a relatively small response time;
* **operating quality** - the system needs to have high availability and to be easily scalable, in order to support any traffic load and meet its performance demands;
* **lifecycle quality** - the system should be designed focusing on maintainability and portability so that the API can be concise and easy to extend at the same time.

## High-level architecture

<!--_Instructions: Information about **Components**, **Activities** and **Infrastructure** (respectively, use UML Component, Activity and Deployment diagrams. Provide higher-level views over these three types of elements using _Package_ diagrams, if appropriate._-->

The following deployment diagram comprises the overall API implementation. 

![](https://i.imgur.com/xL57Qrl.png)

The system is built with 6 separate servers:
- **Uni4all Server** - Main server which the user directly interacts. It provides access to the different components that the user can use. Each component is described in the next section.
- **Redis** - Database used for user authentication.
- **Postgres** - Database used for storing necessary data from the different components.
- **Mongo Chat**, **Mongo Chat Server**, **Chat Server** - Servers needed for the Chat component. The interactions between these servers are described in the component's documentation.

### Components

- [Authentication](./authentication.md), **T2G1**  
This component allows users to register, login, and manage their accounts in uni4all, particularly by updating or recovering the password or even by deleting the account. It also provides a solution for the authorization process that can be used by other components to control the access to certain resources that require the user to be authenticated.
- [Scraping](./scraping.md), **T1G4** , **T1G3** (meals)
- [Chat](./chat.md), **T1G3**  
In the chat component, users can chat with their academic social circles. The main features allow users to view their groups and messages per group, create and join a group and send and receive messages in real time.
- [Payments](./payments.md), **T1G1** 
- [Notifications](./notification.md) **T2G3**
- Calendar: [T1G2](./t1g2-calendar.md), **T1G2**; [T2G4](./t2g4-calendar.md), **T2G4**; 
- [Group Making](./groupMaking.md), **T2G5** 
- [Feedback](./feedback.md), **T2G2**: canteen/bar meals, classes/teachers
- [Capacity](./capacity.md), **T2G2**: capacity at each parking lot in FEUP
- [Queues](./queues.md), **T2G2**: queues in each canteen/bar at FEUP
- [Jobs](./jobs.md), **T1G2** 

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

