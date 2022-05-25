# Calendar Events

## Endpoints

### GET `/calendar`

This route was created to retrieve the calendar events, it will return a response with a status code of:
- 201 if the request was made successfully
- 500 if there was an unexpected error

All of the responses will also include a message with their description.

This route may receive two parameters (both optional):
- `startDate` in format YYYY-MM-DD. Defaults to today
- `endDate` in format YYYY-MM-DD. Defaults to null (retrieves all future events)

This route requires authentication.

### POST `/calendar/create`

This route was created to add an event to a calendar, it requires seven parameters to add an event:
- `summary` - the title of the event. Required string
- `description` - the description of the event. Optional string
- `location` - the location of the event. Optional string
- `date` - the date of the event. Required string in format YYYY-MM-DD
- `startTime` - the start time of the event. Required string in format HH:MM:SS
- `endTime` - the end time of the event. Required string in format HH:MM:SS
- `recurrence` - the recurrence rule of the event. Optional string in format TBD.

It will return a response with a status code of:
- 201 if the event was successfully added
- 400 if one of the parameters is missing or invalid
- 500 if there was an unexpected error

All of the responses will also include a message with their description.

This route requires authentication.