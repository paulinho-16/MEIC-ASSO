# uni4all

Welcome to the repository supporting the development of the uni4all project, developed as part of the practical classes of the FEUP/M.EIC/ASSO/2021-22 course.
 
# Product

Use this section to provide a high-level view over what the product intends to provide in terms of function and non-functional requirements. These high-level requirements will later be broken up and documented as user stories. 

## Vision

## Product themes

# Product Themes

**Note:**

- **already** - themes that were set by the tuesday class
- **edited** - already themes that were edited by the friday class

- **(already)** Car sharing
- **(already) (edited)** Authentication
- User profiles
- **(already) (edited)** Meals
    - cantine
    - bares
    - grill
    - SASUP
- **(already)** Schedule management
    - **(already) (edit)** Algorithm to optimize schedule, synchronization
    - **(already)** Exams schedule
    - **(already)** Other events
    - Personal schedule
    - Services (e.g. Library schedule)
- **(already) (edited)** FEUP Classrooms
- **(already)** Group formation - project groups, study groups and class
- **(already) (edited)** Library
    - book reservation (and delivery dates)
    - capacity
    - classrooms
- **(already) (edited)** External systems
    - GPS systems (e.g. study places)
    - housing
    - external places to eat (together with meals)
- **(already)** Scheduling appointments
    - Psychologist
- **(already)** Registering for stuff: Pick classes, UCs, register for 2nd call exams
- **(already)** Presence in practical classes
- **(already)** Feedback (about everything)
    - Trouble tickets
- **(already) (edited)** News
- Job listings management
- Printing system
- Appliances system (Projeto Integrador)
- Student Associations
- Chat (class groups)
- Notifications
    - Calendar (deliveries, exams, tests...)
- Queues / Crowd Sourcing
- Mentoring app (erasmus students also)
- Accio with comments
- Payments (Balance)
## Quality attributes

This section should give an idea of the high-level non-functional requirements.


# Architecture and design

## Challenges and foreseen possible solutions

This section is responsible for identifying architectural and design challenges, as well as the solutions that we foresee may be useful to address them. Many of these solutions can (and should) be expressed as architectural patterns.

- Data Storage
  - Chats need lots of small writes and reads
  - Scalability
  - Performance
- Privacy
- Efficiency when dealing with scrapped data
- How to combine data from different sources? (e.g. calendar)
- Real-time communication in chats
- Multiple authentication strategies
- Security in payments

## Components

* Profiles
* Authentication
* Scraping
* Chat
* Calendar
* Payments
* Group Making
* Feedback
* Library
* Mapping
* Food
* Housing
* Registrations

## Logical architecture

Document the high-level logical structure of the system, using a UML diagram with logical packages, without the worry of allocating to components, processes or machines.

It can be beneficial to present the system both in a horizontal and vertical decomposition:

 * Horizontal decomposition may define layers and implementation concepts, such as the user interface, business logic and concepts.
 * Vertical decomposition can define a hierarchy of subsystems that cover all layers of implementation.


## Physical architecture

Document the high-level physical structure of the software system (machines, connections, software components installed, and their dependencies) using UML deployment diagrams or component diagrams (separate or integrated), showing the physical structure of the system.

It should also describe the technologies considered and justify the selections made. 


# Development

Include here instructions for ...
 * setting up the development environment
 * running the system in the development environment
 * running the tests

# Operation

Include here instructions for ...
 * setting up a production environment
 * building and packaging the system for deployment
 * deployment the system to production
 * operating the system (where the logs are, what monitoring tools are in place, etc.)


# Other information

Things will break. Deal with it, together.

