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
