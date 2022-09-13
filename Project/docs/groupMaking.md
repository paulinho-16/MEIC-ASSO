# Group Making

## Content

* [Component Envisioning](#Component-Envisioning)
* [Design and Architecture](#design-architeceture)


<a name="Component-Envisioning"/>

## Component Envisioning

Groups and team work is an essencial part of a student's life. This includes both groups for class projects as well as study groups.

This component helps students on their academic daily life by proving an API that supports the creation, listing and joining of groups making this process easier.


<a name="design-architecture"/>

## Design and Architecture


### How to share knowledge with the clients about the API endpoints?

**Context:**

The *Group Making* module should be available as an API provider for its clients. How should the API endpoints be documented to be more easily understood and consumed by its clients? 

**Solution:**

To fulfill that goal, an [API Description](https://microservice-api-patterns.org/patterns/foundation/APIDescription) should be provided that defines request and response message structures and error reporting.

A Swagger documentation is provided for this module. 

**Consequences:**

+ This description being minimal is easy to evolve and mantain. 
+ Helps clients during the frontend integration process.  

- Continuous effort on maintaing documentation updated while API evolves. 


### How can the API provider deliver exactly the number of items the client needs for? 

**Context:**

The *Group Making* module makes available a number of endpoints with which the clients can fetch a list of items: get groups, get group's members and get group's admins. 

How can the API provider not overwhelm the client with to much data? Or how can the client request and receive for the exact number of items it needs? 

**Solution:**

This can be achived throught the implementation of [Pagination](https://microservice-api-patterns.org/patterns/structure/compositeRepresentations/Pagination).

**Mapping:**

Endpoints that can be used to fetch a list of an items have two query parameters - *offset* and *limit* - with which the client can specify the number of items it needs. 

Data is divided in sets (pages) and the page is specified through the *offset* query parameter. 

The number of items from that page to return are specified through the *limit* query parameter.

**Consequences:**

+ Improved resource consumption and possible improvements in performance as well. 

- If there is a need for returning items in a random order, a more complex parameter representation is required. 


### How can the API provider authenticate different users when receiving requests?

**Context:**

The *Group Making* module offers endpoints that can be used only by authenticated users. For example, a user should only be able to join a group project if he is a student in that class. 

How can the *Group Making* module identify the user that is triggering the request without having the need to transmit user account credentials? 

**Solution:**

This can be achieved through the use of an [API Key](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/APIKey) that is passed from the user with each request through the HTTP *Authorization* header. 

For this, the *Group Making* module uses the *Authentication* middleware implemented by another module which standarizes authentication and authorization for the different modules in the system. 

**Consequences:**

+ With an **API Key** the endpoint can identify the client. 
+ Using and **API Key** instead of the user's account credentials decouples different users roles from each other. 

### How can an API provider inform its clients about communication and processing faults? 

**Context:**

While using any endpoint in the API the user may face different errors such as: unauthorized access, input error, invalid operation.
This kinds of errors can either be the fault of the client or of the API provider so it's important to transmit this type of information in a consistent manner.

**Solution:**

Reply with an error code in the response message that indicates and classifies the fault in a simple, machine-readable way. In addition, add a textual description of the error for the API client stakeholders (which could be developers and/or end users such as administrators).

**Consequences:**

+ An error report that contains a code allows the API consumer to handle the error programmatically and to present an internationalized, human-readable message to the end-user.
- May expose provider-side implementation details or other sensitive data that can be used for cyberattacks. 


