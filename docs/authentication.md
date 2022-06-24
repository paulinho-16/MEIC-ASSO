# Authentication and Authorization

## Contents
* [Features](#features)
* [Technologies](#technologies)
* [High-level architecture](#high-level-architecture)
* [Design and architecture](#design-and-architecture)
* [Usage](#usage)
    * [Authentication Endpoints](#authentication-endpoints)
    * [User Endpoints](#user-endpoints)
* [Contributing](#contributing)

## Features

- Login
- Password and email validation
- Register
- Logout
- Update Password
- Password Recovery
- Delete account

## High-level architecture

![](https://i.imgur.com/LtpWIge.png)

This diagram describes the main components used in Uni4all to provide authentication, authorization and account management functionalities to the end user.
Uni4all is composed of many services (**API Service**), which may or not require the user to be authenticated. One of these services is the **Authentication Service**, the main focus of this section. It provides the login, register and logout endpoints to the **client App**. This service uses a **Postgres** database to store the users' credentials (email and password) upon a successful registration. It also uses the **Redis** database to store or terminate the session of the user upon a successful login or logout, respectively.
Another main component that will be referred in this section is the **User Service**, which exposes some endpoints that allow the user to manage his password or delete his account.
This service also consults and modifies the User table of the **Postgres** database.
Finally, our component provides the **Authentication Middleware** to any service of the App that needs to guarantee that only authenticated users can access its resources and functionalities. This middleware provides token and session verification to any endpoint that requires it. To do so, it needs to verify the validity of the token that is sent by the user by consulting **Redis** database.
To better understand how the tokens are used and how the authorization process works, please refer to the [Example Sequence Diagram](#example-sequence-diagram) section.

### Example Sequence Diagram

In order to authenticate the Users we decided to use Json Web Tokens for reasons that will be described in the [Design and Architecture section](#design-and-architecture), particularly in the [Access Token](#access-token) and [Client Session State](#client-session-state) patterns.
In order to illustrate the sequence of requests and the interaction between the components of the system that allow the user to get and use this access token, we created two sequence diagrams:
- The first describes the registration and login operations, which allows the user to get an access token.
- The second shows how this token can be used in order to get access to an endpoint that requires the user to be authenticated.

#### Get access token

Upon registration, a user is created in the **Posgres** database and a success response is returned to the User.
When the user logs in, the **Authentication Service** will get his id from **Postgres**, create a JWT for that user and store it in the **Redis** database. Finally, a successful response is returned to the client app.

![](https://i.imgur.com/9xednVD.png)

#### Use access token

If the client App wants to access a protected service it must send a request to the respective endpoint by including the access token in the Authorization Header or in a cookie. The endpoint will then use the **Authentication Middleware** to verify the signature of the token and check if it corresponds to a valid session. If the token is valid, the code that concerns to the requested service will execute and the response is sent to the client App.
We emphasize that if the token is invalid the user won't be able to access the protected content of the requested service and an error will be returned to the client App.

![](https://i.imgur.com/y0sUcM9.png)

## Technologies

- Nodemailer: to send the password recover email
    - This package was chosen because it simplifies the process of sending emails and is known to be very reliable and popular. Nodemailer is also a single package with zero dependencies that focuses on security.
- Redis: for session storage
    - Redis can function as an in-memory data store, which makes it very fast. This allows us to reduce the overhead caused by having to access the database with each request to verify the validity of the token.
- PostgreSQL: to store the credentials (email and password) of the user
    - PostgreSQL is a very popular and feature-rich database, allowing us to store data that does not need to be retrieved very quickly.


## Usage

### Authentication Endpoints

Detailed information about these endpoints can be found in swagger's API documentation: https://uni4all.servehttp.com/api-docs/#/Authentication.

#### GET `/authentication`

This example route was created in order to test the authentication. It will return a JSON response with a message field whose value will depend on the status code. On success, the response will include the ID of the authenticated user, otherwise an error message is returned.

#### POST `/authentication/login`

This route must be used in order to authenticate, and it requires two parameters: `email` and `password`.

It verifies the validity of the email and password and, if the login is successful, a JSON response is returned with a success message, the ID of the user and the JWT, for example:
```json
{
    "message": "Login with success",
    "id": 11,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY1NTQ2NDMwOCwiZXhwIjoxNjU1NzIzNTA4fQ.Is_sAEggVqkcox_XTZAKia9fsOe_AhSaC655ikEES3E"
}
```
This token should be included in all subsequent requests that require the user to be authenticated. It can be sent in the Authorization Header through the Bearer Schema or using cookies, given that our implementation supports both approaches.

#### POST `/authentication/logout`

The logout route doesn't require any parameters. It requires the user to be authenticated, and it is responsible for deleting the session cookie and for invalidating the session of the user.

#### POST `/authentication/register`

This route enables the user to create an account by providing the `email` and `password`. It also validates the email and verifies the strength of the password.

### User Endpoints

Detailed information about these endpoints can be found in swagger's API documentation: https://uni4all.servehttp.com/api-docs/#/User.

#### DELETE `/user/:id`

This route allows the user to delete his account. It requires the user to be authenticated and also to provide his `password` for greater security.

#### PUT `/user/update-password/:id`

This route may be used to update the password of the user. It requires two parameters, namely the `oldPassword` and the `newPassword`.

In order to use this route, the user must be authenticated.

#### POST `/user/forgot-password`

This route can be used by a user that does not remember his password. By proving the `email` as parameter, the user can get a token via email, which can then be used to change the password to a new one.

#### POST `/user/reset-password`

This endpoint must be used after making a request to the previous endpoint (`/user/forgot-password`). It allows the user to insert the `token` received by email and a new password. If the token is valid and the password is strong enough, then the password of the user will be updated.

## Design and architecture
### Access Token
> Pattern Type: Architectural Pattern
> Reference: [Access Token](https://learning.oreilly.com/library/view/architectural-patterns/9781787287495/2f3c5677-2687-4338-bf23-72dbb77828f8.xhtml)

#### Context

In Uni4all API, there are multiple services that need to authenticate the User in order to verify his identity and authorize the access to protected resources. In order to provide a single interface that can be reused by each of these services, the **Access Token** pattern was used.

#### Mapping

![](https://i.imgur.com/N0uidLk.png)

Based on this diagram, the Flutter Apps would be the client, which would send an Access Token, particularly a JWT, to the API endpoints that require authentication or authorization. Our Authentication service, in particular the middleware, intercepts the requests to verify if a token is present in the Authorization Header or in a cookie and if it is valid (authenticating the user). Otherwise, an error message is returned. When authentication is successful the request is then passed on to the service which was its intended recipient.

#### Consequences

##### Pros

- Using an access token improves security by allowing us to confirm a user's identity by analyzing the token provided with the request using a secret key (which was also used to create the token);
- From a usability standpoint, it also removes the need to force the user to authenticate with every request sent.


##### Cons

- Despite the security benefits, there is also a downside, if the secret key that is required for token creation and validation is not stored correctly and an attacker gains access to it, they could impersonate other users and perform actions they should not be able to perform;
- An access token also contains more information than a normal session token, this increases the amount of data that needs to be exchanged, leading to a higher network overhead;
- Because JWTs are being used, the tokens have a short lifespan, forcing the user to login again from time to time instead of being able to stay logged in indefinitely.



### Error Report
> Pattern Type: API Pattern
> Reference: [Error Report](https://microservice-api-patterns.org/patterns/quality/qualityManagementAndGovernance/ErrorReport)

#### Context

The authentication and user services need to report the result of its operations to the user, so that he knows if his request was successful. At the same time, the request must conform to the HTTP response format so that the client App knows how to proceed depending on the error code.

#### Mapping

![](https://i.imgur.com/QKpBwIL.png)
A request sent to one of the authentication or user endpoints will result in a JSON response that includes the appropriate [HTTP status code](https://restfulapi.net/http-status-codes/), which classifies the fault in a simple, machine-readable way. It also includes a textual description of the error for the client - `message`.

#### Consequences

##### Pros

- Error messages allow the end user to understand what generated the error in a simplistic way;
- Having a detailed report of the error may help achieve a solution.

##### Cons

- Having a very detailed explanation may expose sensitive data and other details related to provider side implementation.

### Client Session State
> Pattern Type: Enterprise Pattern
> Reference: [Client Session State](https://www.martinfowler.com/eaaCatalog/clientSessionState.html)

#### Context

When exchanging information with a client, our server needs to be able to keep state information. As HTTP is a stateless protocol, we need to use tokens to be able to improve the user experience, allowing a client to stay logged in without having to keep sending his credentials. In our case, the token will be sent in the Authorization Header or in a cookie.

#### Mapping

![](https://i.imgur.com/7AImErP.png)

A client, upon logging in, receives a JSON Web Token which he must then send to the server on every request that requires authentication by adding it to the Authorization Header or by using the cookie that is set by the server. The server uses the token to obtain the current state of the session, identify the user, and responds to the request accordingly.

#### Consequences

##### Pros

- By using a token to keep the session state, we only need to validate the token in each request instead of having to check the credentials;
- Like previously mentioned, this allows a user to stay logged in without having to send his credentials in every request, improving usability;

##### Cons

- Logout is not possible: the session token can be dropped from the browser (in case of a cookie) or from storage, but it would still work if resubmitted, unless other workarounds are used to avoid that (which is the case);
- Performance burden due to the decryption and encryption of the data in the token in each request.

### Saving User Login Information

#### Context

JSON Web Tokens are sent as a response to login requests, but these tokens have a specified lifetime. A priori, we have no way to invalidate it before it expires, which is necessary when the user wants to log out.

#### Mapping

We can save the session information in a database when the user logs in and remove it on logout. However, this implies a verification of each request containing tokens, and that's why a cache database like Redis is better for this purpose.

#### Consequences

##### Pros

- We have a way to check if the tokens are active
- We can invalidate tokens, so that people cannot use them anymore, which is needed for the logout functionality

##### Cons

- We need to establish connections to the database in every authenticated request, to validate the token
- The overhead can be mitigated by using a fast in-memory data store like Redis, but the overhead is still there either way


### SIGARRA's Authentication

#### Context:
Some functionalities that Uni4all provides, such as the access to the schedule or classes, require the User to be authenticated in SIGARRA. However, SIGARRA does not provide any means to authenticate via an API or OAuth.

For security reasons, we decided that our server should not receive SIGARRA's credentials at any point. This way, if there is a crash on our Server, it won't compromise SIGARRA's credentials.

The requests for pages that require authentication will be sent on the client-side directly to SIGARRA. SIGARRA will reply with the HTML of the requested page, which should be forwarded to the endpoint of our server that performs the scrapping of the respective HTML and returns the processed information.
> Further details on how to proceed if you need to perform scraping of a page that requires SIGARRA's authentication are available in the *Scraping* documentation under the subtitle [Scraping of SIGARRA's protected pages](./scraping.md#Scraping-of-Sigarras-protected-pages) .

#### Mapping:
> N/A: This solution does not map to a pattern

#### Consequences:
##### Pros:
- Security: By adopting this solution, the credentials will only be sent to our server. Therefore, a crash or attack to our server will not reveal sensitive information that could indirectly affect SIGARRA.

##### Cons:
- Latency: the number of requests/responses leads to an increase in latency.

## Contributing

### Authentication Middleware

#### Context - How are we authenticating the user?

In order to authenticate the user, we use JWT tokens. These tokens are sent to the user upon a successful login, both in the response and in a cookie. The JWT token must then be sent in every request that requires authentication and authorization. For that, the request may send the **cookie**, or it can set the **Bearer Token in the Authorization header**.

#### Usage of the Authentication Middleware

If a service needs to authenticate the user before providing access to a resource, it can use the **authentication middleware** to do so, particularly the `verifySessionToken` middleware function.
You just need to define your route like the one below, setting the first and third parameters with the appropriate path and handler:
```typescript=
import auth from '@/middleware/auth'
router.get(PATH, auth.verifySessionToken, HANDLER)`
```
If you need to know who is accessing your endpoint, you can access the ID of the user, which will be set by our middleware in the request body (`req.body.id`).

In the file that contains the authentication routes, you can find an example route (`testAuth`), which returns as a response the ID of the user if a valid access token is provided. Otherwise, an error message will be returned.
