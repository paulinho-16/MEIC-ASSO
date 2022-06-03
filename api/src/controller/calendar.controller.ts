import { Request, Response } from 'express'
import { Event } from '@/@types/events'

import events from '@/services/calendar'

const marketing = {
  acronym: 'MK',
  'week day': 'Tuesday',
  time: '14:00-17:00',
  room: 'B020',
  teacher: 'GB',
  type: 'TP',
}

const gestao_empresas = {
  acronym: 'GEE',
  'week day': 'Thursday',
  time: '14:00-17:00',
  room: 'B006',
  teacher: 'MR',
  type: 'TP',
}

const cpm1 = {
  acronym: 'CPM',
  'week day': 'Tuesday',
  time: '09:00-10:30',
  room: 'B229',
  teacher: 'APM',
  type: 'TP',
}

const cpm2 = {
  acronym: 'CPM',
  'week day': 'Thursday',
  time: '15:30-17:00',
  room: 'B343',
  teacher: 'APM',
  type: 'TP',
}

const sigarra_timetable = [marketing, gestao_empresas, cpm1, cpm2]

const evaluation_assessment = {
  acronym: 'MK',
  day: '21 junho',
  time: '11:30-13:30',
  rooms: 'B113',
}

function parseJSONTimetable(sigarra_timetable: JSON) {
  //for(let i = 0; i  < sigarra_timetable; i++){
  //}
}

async function getCalendarEvents(req: Request, res: Response) {
  let startDate
  if (req.query.startDate == null) {
    const today = new Date()
    startDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  } else {
    startDate = req.query.startDate.toString()
  }
  const endDate = req.query.endDate == null ? null : req.query.endDate.toString()
  const retval = await events.getCalendarEvents(req.body.id, startDate, endDate)
  if (retval !== false) {
    res.status(201).send(retval)
  } else {
    res.status(500).send('Something went wrong. Try again!')
  }
}

async function addCalendarEvent(req: Request, res: Response) {
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
  if (
    req.query['summary'] == null ||
    req.query['date'] == null ||
    req.query['startTime'] == null ||
    req.query['endTime'] == null
  ) {
    console.log(req)
    res.status(400).send('Invalid syntax!') // trocar para json com codigo de erro
    return
  }

  const new_event: Event = {
    summary: req.query.summary.toString(),
    description: req.query.description == null ? null : req.query.description.toString(),
    location: req.query.location == null ? null : req.query.location.toString(),
    date: new Date(req.query.date.toString()),
    startTime: new Date(req.query.date.toString() + ' ' + req.query.startTime.toString()),
    endTime: new Date(req.query.date.toString() + ' ' + req.query.endTime.toString()),
    recurrence: req.query.recurrence == null ? null : req.query.recurrence.toString(),
    isUni: false,
  }

  const retval = await events.createEvent(new_event)

  if (retval != false) {
    const eventId = retval
    const data = await events.createEventRelation(eventId, req.body.id)
    if (data) {
      res.status(201).send('Success')
    } else {
      res.status(500).send('Something went wrong. Try again!')
    }
  } else {
    res.status(500).send('Something went wrong. Try again!')
  }
}

async function deleteCalendarEvent(req: Request, res: Response) {
  if (req.params.id == null) {
    console.log(req)
    res.status(400).send({ linesDeleted: 0, message: 'Invalid request syntax, missing id parameter!' })
    return
  }

  const retval = await events.deleteEvent(req.params.id as string)
  res.status(200).send(retval)
}

async function updateCalendarEvent(req: Request, res: Response) {}

export default {
  getCalendarEvents,
  addCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
}
