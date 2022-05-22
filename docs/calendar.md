# Calendar Events

## Endpoints

### GET `/calendar`

This route was created to retrieve the calendar events, it will return a response with a status code of:
- 201 if the request was made successfully
- 500 if there was an unexpected error

All of the responses will also include a message with their description.

This route requires authentication.

### POST `/calendar/create`

This route was created to add an event to a calendar, it requires seven parameters to add an event:
- `summary`
- `description`
- `location`
- `date`
- `startTime`
- `endTime`
- `recurrence`

It will return a response with a status code of:
- 201 if the event was successfully added
- 400 if one of the parameters is missing or invalid
- 500 if there was an unexpected error

All of the responses will also include a message with their description.

This route requires authentication.
