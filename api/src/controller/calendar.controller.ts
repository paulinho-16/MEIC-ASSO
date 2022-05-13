import { Request, Response } from 'express'

const marketing = {
  'acronym': 'MK',
  'week day': 'Tuesday',
  'time': '14:00-17:00',
  'room': 'B020',
  'teacher': 'GB',
  'type': 'TP'
}

const gestao_empresas = {
  'acronym': 'GEE',
  'week day': 'Thursday',
  'time': '14:00-17:00',
  'room': 'B006',
  'teacher': 'MR',
  'type': 'TP'
}

const cpm1 = {
  'acronym': 'CPM',
  'week day': 'Tuesday',
  'time': '09:00-10:30',
  'room': 'B229',
  'teacher': 'APM',
  'type': 'TP'
}

const cpm2 = {
  'acronym': 'CPM',
  'week day': 'Thursday',
  'time': '15:30-17:00',
  'room': 'B343',
  'teacher': 'APM',
  'type': 'TP'
}

const sigarra_timetable = [
  marketing, gestao_empresas, cpm1, cpm2
]

const evaluation_assessment = {
  'acronym': 'MK',
  'day': '21 junho',
  'time': '11:30-13:30',
  'rooms': 'B113'
} 

function parseJSONTimetable (sigarra_timetable){
  for(let i = 0; i  < sigarra_timetable.length; i++){
    
  }
} 




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
