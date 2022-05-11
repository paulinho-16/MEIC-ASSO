import { Request, Response } from 'express'

async function getCalendarEvents(req: Request, res: Response) {
    // TODO: connect with database (not set up yet)

    const event = {
        'summary': 'Google I/O 2015',
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': '2016-09-28T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        'end': {
          'dateTime': '2016-09-28T17:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10},
          ],
        },
    }

    return res.send(event)
}

async function addCalendarEvent(req: Request, res: Response) {
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    if (req.query["summary"] == null || req.query["location"] == null || req.query["description"] == null || req.query["start_time"] == null || req.query["end_time"] == null)
    {
        res.send("Invalid syntax!")
        return
    }

    const summary = req.query["summary"];
    const location = req.query["location"];
    const description = req.query["description"];
    const start_time = req.query["start_time"];
    const start_time_timezone = req.query["start_time_timezone"];
    const end_time = req.query["end_time"];
    const end_time_timezone = req.query["end_time_timezone"];

    const event = {
        'summary': summary,
        'location': location,
        'description': description,
        'start': {
          'dateTime': start_time,
          'timeZone': start_time_timezone,
        },
        'end': {
          'dateTime': end_time,
          'timeZone': end_time_timezone,
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10},
          ],
        },
    }

    return res.send(event)
}

export default {
    getCalendarEvents,
    addCalendarEvent
}
