# Calendar Events

## Endpoints

### GET `/calendar`

This route was created to retrieve the calendar events, it will return a response with a status code of:
- 200 if the request was made successfully
- 500 if there was an unexpected error

All of the responses will also include a message with their description.

This route may receive these query parameters:
- `wishlist` an array of strings that describes the type of events the user wants to receive. Supported types of events are TIMETABLE (from the SIGARRA schedule), CUSTOM (created by the user) and EXAM (from the user's SIGARRA exam calendar). Defaults to all types. Example: `?wishlist=EXAM&wishlist=TIMETABLE`.
- `eventWishlist` an array of strings that contains the fields of each event the user wants to receive. Supported types of events are: id, summary, description, location, date, starttime, endtime, recurrence and type. Defaults to all fields. Example: `?eventWishlist=summary&eventWishlist=date&eventWishlist=location`.
- `startDate` in format YYYY-MM-DD. Defaults to today.
- `endDate` in format YYYY-MM-DD. Defaults to null (retrieves all future events).
- `studentCode` SIGARRA code of the student, without 'up'. Example: 20180XXXX.

All of the parameters are optional, with the exception of the studentCode if the user wishes to obtain timetable or exams events.

This route requires authentication.

### POST `/calendar/event`

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

### GET `/calendar/google-calendar-token`

This route was created to generate an authentication token in the Google API, it will return a response with a status code of:
- 200 if the request was made successfully

This route may receive one parameter (automatically sent after the user authorizes the app):
- `code` if sent it will retrieve a Refresh Token, else it will retrieve an Auth URL.

If it doesn't receive the parameter `code`, the response will include the Auth URL.

This response, after the authorization has been granted, includes: 
- `access_token`
- `refresh_token`
- `scope`
- `token_type`
- `expiry date`

This route requires authentication.

### POST `/calendar/exportgc`

This route was created to export events to the Google Calendar:
- `gctoken` - the Google Calendar Token (to generate this token, use the route /google-calendar-token)

It will return a response with a status code of:
- 200 if successfully exported events to Google Calendar
- 500 if there was an unexpected error

All of the responses will also include a message with their description.

This route requires authentication.
