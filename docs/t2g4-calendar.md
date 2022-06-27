# Calendar Endpoint

# **Calendar Events**

## **Features**

- Retrieve all events
    - The user can retrieve all of the events related to them - i.e. events created by them and the ones coming from their SIGARRA account.
- Create custom user events
    - The user can create custom events - i.e. events that were created by them and don't come from SIGARRA.
- Export Uni4All Calendar to Google Calendar
    - The user can create an authentication token to give access to their Google Account’s Calendar services and then export the events from the Uni4All Calendar to their Google Account’s Google Calendar.

## **Technologies**

Same stack used in the global Uni4all Application (Express framework with TypeScript).

- API's
    - [Google API](https://cloud.google.com/apis/docs/overview): to handle connections from the Uni4All app to the Google Calendar Services (Google Calendar and Google Events).
- Database
    - [Postgres](https://www.postgresql.org/): to store all of the calendar events (including custom user-defined events and SIGARRA events), as they all have similar structure.
- Authentication
    - [OAuth2.0](https://oauth.net/2/): Industry-standard protocol for authorization in Google API.

## High-level Architecture

![Architecture](https://i.imgur.com/ELR5Lkp.png)

This is the high-level architecture based on a **layered architecture** as there can be a clear separation of layers and a better relation to the architecture of group T1G2 since the architecture is connected.

Our architecture is mainly based on the logic layer where we communicate with Google OAuth API to request and retrieve tokens and use them in order to be able to create a calendar in the Google Calendar Service and then insert the Uni4All events into it, using Google Calendar API.

## Design and Architecture

### Facade

Pattern Type: Interface Partitioning

**Context**

In Uni4all we must make our code work with a broad set of objects that belong to a sophisticated library or framework → Google API. This pattern defines a higher-level interface that makes the subsystem easier to use.

We use the Facade Pattern to wrap a third-party integration: Google APIs. Those APIs are general-purpose tools designed to solve many different types of problems. 

**Mapping**

![Mapping](https://i.imgur.com/fQxOOac.png)

**Consequences**

We use the Facade Pattern to "wrap" our integration and only expose the functionality we require. And we only require a small subset of the functionalities that Google API provides, such as create a calendar and add events to it.

**Pros**

- Simplify the Google API interface to access only the subset we require.
- Clients don’t know about the underlying implementation of the integration, only the function names, what parameters it takes and what it sends back.

**Cons**

- Complex implementation.

## **Endpoints**

### **GET `/calendar`**

This route was created to retrieve the calendar events. It will return a response with a status code of:

- 200 if the request was made successfully
- 500 if there was an unexpected error

All of the responses will also include a message with their description.

This route may receive these query parameters:

- `wishlist` an array of strings that describes the type of events the user wants to receive. Supported types of events are TIMETABLE (from the SIGARRA schedule), CUSTOM (created by the user) and EXAM (from the user's SIGARRA exam calendar). Defaults to all types. Example: `?wishlist=EXAM&wishlist=TIMETABLE`.
- `eventWishlist` an array of strings that contains the fields of each event the user wants to receive. Supported types of events are: id, summary, description, location, date, starttime, endtime, recurrence and type. Defaults to all fields. Example: `?eventWishlist=summary&eventWishlist=date&eventWishlist=location`.
- `startDate` in format YYYY-MM-DD. Defaults to today.
- `endDate` in format YYYY-MM-DD. Defaults to null (retrieves all future events).
- `studentCode` SIGARRA code of the student, without 'up'. Example: 20180XXXX.

All of the parameters are optional, with the exception of the studentCode if the user wishes to obtain timetable or exams events.

This route requires authentication.

### **POST `/calendar/event`**

This route was created to add an event to a calendar, it requires seven parameters to add an event:

- `summary` - the title of the event. Required string
- `description` - the description of the event. Optional string
- `location` - the location of the event. Optional string
- `date` - the date of the event. Required string in format YYYY-MM-DD
- `startTime` - the start time of the event. Required string in format HH:MM:SS
- `endTime` - the end time of the event. Required string in format HH:MM:SS
- `recurrence` - the recurrence rule of the event. Optional string in format TBD.

It will return a response with a status code of:

- 201 if the event was successfully added
- 400 if one of the parameters is missing or invalid
- 500 if there was an unexpected error

All of the responses will also include a message with their description.

This route requires authentication.

### **GET `/calendar/google-calendar-token`**

This route was created to generate an authentication token in the Google API, it will return a response with a status code of:

- 200 if the request was made successfully

This route may receive one parameter (automatically sent after the user authorizes the app):

- `code` if sent it will retrieve a Refresh Token, else it will retrieve an Auth URL.

If it doesn't receive the parameter `code`, the response will include the Auth URL.

This response, after the authorization has been granted, includes:

- `access_token`
- `refresh_token`
- `scope`
- `token_type`
- `expiry date`

This route requires authentication.

### **POST `/calendar/exportgc`**

This route was created to export events to the Google Calendar:

- `gctoken` - the Google Calendar Token (to generate this token, use the route /google-calendar-token)

It will return a response with a status code of:

- 200 if successfully exported events to Google Calendar
- 500 if there was an unexpected error

All of the responses will also include a message with their description.

This route requires authentication.

## Future Work

### Google Calendar integration improvements

- Currently, the Google Calendar integration is unilateral (a user can only export the events from the Uni4All calendar to the Google Calendar Service). However, one of the goals for the future would be to make this integration bilateral, which means that a user would be able to also import his events and calendars to the Uni4All Calendar service.
- Even though the Google Calendar API for events accepts a ***recurrence*** parameter, it is not defined in a compatible way to the recurrence present in the Uni4All events. With this being said, in the future it would be important to reconfigure the event recurrence that the Uni4All app is using to be more similar to the one used by Google Calendar API in order to facilitate both exports (with the current version of the API) and imports (after implementing the functionality mentioned above).
