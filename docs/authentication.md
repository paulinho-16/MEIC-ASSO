# Authentication and Authorization

## Endpoints

### GET `/authentication`

This route was created for testing the authentication, it will return a response with a status code of:
- 200 if the request was made with a valid token
- 403 if no token was provided
- 401 if the provided token is invalid
- 400 if the user associated with the token does not exist anymore

All of the responses will also include a message with their description.

### POST `/authentication/login`

This is the login route, it requires two parameters for the account creation:
- `email`
- `password`

It will return a response with a status code of:
- 200 if the user was successfully logged in
- 400 if something was wrong, which includes:
    - Not passing one of the parameters
    - Passing an e-mail that is not registered
    - Using a wrong password

All of the responses will also include a message with their description.

The login of a user is the creation of a HttpOnly cookie, with a lifetime defined in the environment variables.

### POST `/authentication/logout`

This is the logout route, it requires no parameters, but there must be a logged in user, in which case the cookies related to the login will be deleted, otherwise the same error codes as in the authentication testing route will appear in the response.

### POST `/authentication/register`

This is the register route, it requires two parameters for the account creation:
- `email`
- `password`

It will return a response with a status code of:
- 200 if the user was successfully created
- 400 if something was wrong, which includes:
    - Not passing one of the parameters
    - Passing an invalid e-mail
    - Using an e-mail that is already registered
    - The password is too weak
    - Some error when dealing with the database

All of the responses will also include a message with their description.

### DELETE `/user/:id`

This is the route for account deletion, it requires one parameter for the account deletion:
- `password`

But there must be a logged in user, otherwise the same error codes as in the authentication testing route will appear in the response. Other status codes for responses that can be returned are:
- 200 if the account is successfuly deleted
- 400 if one of the following error happens:
    - The parameter was not provided
    - The password in invalid for the logged user
    - Some error when deleting the account from the database
All of the responses will also include a message with their description.

### PUT `/user/update-password/:id`

This is the route for password changes, it requires two parameters for the password update:
- `oldPassword`
- `newPassword`

But there must be a logged in user, otherwise the same error codes as in the authentication testing route will appear in the response. Other status codes for responses that can be returned are:
- 200 if the password is successfuly updated
- 400 if one of the following error happens:
    - One of the parameters was not provided
    - The old password in invalid for the logged user
    - The new password is too weak
    - Some error when updating the account in the database

All of the responses will also include a message with their description.

## Technologies 

- nodemailer: to send the password recover email
- redis: for session storage
- postgres: to store the credentials (email and password) of the user

## Patterns

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

#### Context:
Some of the functionalitites that Uni4all provides, such as the access to the schedule or classes, require the User to be authenticated in Sigarra. However, Sigarra does not provide any means to authenticate via an API or OAuth.

For security reasons, we decided that our server should not receive Sigarra's credentials at any point. This way, if there is a crash on our Server, it won't compromise Sigarra's credentials.

The requests for pages that require authentication will be sent on the client-side directly to Sigarra. Sigarra will reply with the HTML of the requested page, which should be forwarded to the endpoint of our server that performs the scrapping of the respective HTML and returns the processed information.
> Further details on how to proceed if you need to perform scraping of a page that requires Sigarra's authentication are available in the *Contributing* section under the subtitle [Scraping of Sigarra's protected pages](#Scraping-of-Sigarras-protected-pages) .

#### Mapping:
> N/A: This solution does not map to a pattern

#### Consequences:
##### Pros:
- Security: By adopting this solution, the credentials will only be sent to our server. Therefore, a crash or attack to our server will not reveal sensitive information that could indirectly affect Sigarra.

##### Cons:
- Latency: the number of requests/responses leads to an increase in latency.

## Contributing

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
