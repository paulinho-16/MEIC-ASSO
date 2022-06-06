import axios from 'axios'

import { Request, Response } from 'express'
import { Event } from '@/@types/events'
import { DateTime } from 'luxon'

import events from '@/services/calendar'

export enum EventType {
  CUSTOM = 'CUSTOM',
  TIMETABLE = 'TIMETABLE',
  EXAM = 'EXAM',
  PUBLIC = 'PUBLIC',
}

const weekdays: { [day: string]: number } = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
}

const eventParameters = [
  'id',
  'summary',
  'description',
  'location',
  'date',
  'starttime',
  'endtime',
  'recurrence',
  'type',
]

function getWeekDaysBetweenTwoDates(leftISO: string, rightISO: string, weekday: string) {
  // using luxon library to deal with special cases (e.g. daylight savings time)
  let currentDate = DateTime.fromISO(leftISO)
  const targetWeekDay = weekdays[weekday]
  const result = []

  while (currentDate <= DateTime.fromISO(rightISO)) {
    const currentWeekDay = currentDate.weekday
    if (currentWeekDay === targetWeekDay) result.push(currentDate)
    const diff =
      targetWeekDay > currentWeekDay
        ? targetWeekDay - currentWeekDay
        : targetWeekDay + 7 - currentWeekDay // number of days needed to get to the next desired week day

    currentDate = currentDate.plus({ days: diff })
  }
  return result.map(v => v.toISODate())
}

function parseBlockDateToISO(date: string) {
  // blockStartDate: '27-02-2022', blockEndDate: '11-06-2022'
  const parts = date.split('-')
  return `${parts[2]}-${parts[1]}-${parts[0]}`
}

async function indexTimetable(userId: string) {
  const timetableObject = (await axios.get('http://localhost:3000/schedule/student')).data

  await events.deleteAllEvents(userId, EventType.TIMETABLE)

  const blockStartDate = parseBlockDateToISO(timetableObject.weekBlock.blockStartDate)
  const blockEndDate = parseBlockDateToISO(timetableObject.weekBlock.blockEndDate)

  const scheduleTable = timetableObject.scheduleTable

  for (let index = 0; index < scheduleTable.length; index++) {
    const classBlock = scheduleTable[index]

    const dates = getWeekDaysBetweenTwoDates(blockStartDate, blockEndDate, classBlock.dayOfTheWeek)

    for (const date of dates) {
      const new_event: Event = {
        summary: classBlock.curricularUnitName,
        description:
          classBlock.dayOfTheWeek +
          ' ' +
          classBlock.classType +
          ' ' +
          classBlock.class +
          ' ' +
          classBlock.professors,
        location: classBlock.room,
        date: new Date(date),
        startTime: new Date(date + ' ' + classBlock.startTime + ':00'),
        endTime: new Date(date + ' ' + classBlock.endTime + ':00'),
        recurrence: 'weekly',
        type: EventType.TIMETABLE,
      }

      const retval = await events.createEvent(new_event)

      if (retval != false) {
        const eventId = retval
        await events.createEventRelation(eventId, userId)
      }
    }
  }
}

async function indexExams(userId: string, studentCode: string) {
  const examsObject = (await axios.get(`http://localhost:3000/student-exams/${studentCode}`)).data

  await events.deleteAllEvents(userId, EventType.EXAM)

  const seasons = examsObject.seasons

  for (let x = 0; x < seasons.length; x++) {
    const season = seasons[x]
    let exams = season.exams

    for (let y = 0; y < exams.length; y++) {
      const exam = exams[y]

      const new_event: Event = {
        summary: exam.curricularUnit + ' ' + season.name,
        description: null,
        location: exam.rooms,
        date: new Date(exam.date), // verify day format
        startTime: new Date(exam.date + ' ' + exam.beginHour + ':00'),
        endTime: new Date(exam.date + ' ' + exam.endHour + ':00'), // verify duration format
        recurrence: null,
        type: EventType.EXAM,
      }

      const retval = await events.createEvent(new_event)

      if (retval != false) {
        const eventId = retval
        await events.createEventRelation(eventId, userId)
      }
    }
  }
}

const eventTypeUpdaters = {
  [EventType.PUBLIC.toString()]: { daysValid: 0, update: async () => {} },
  [EventType.EXAM.toString()]: { daysValid: 1, update: indexExams },
  [EventType.TIMETABLE.toString()]: { daysValid: 1, update: indexTimetable },
}

async function updateEvents(eventType: string, userId: string, studentCode: string) {
  const lastDate: any = await events.getLastScrapeDate(eventType, userId)
  if (lastDate === false) return false

  const currentDate: any = new Date()
  const diffMs = Math.abs(currentDate - lastDate) // diff in milliseconds
  const diffDays = diffMs / 1000 / 3600 / 24

  if (diffDays >= eventTypeUpdaters[eventType].daysValid) {
    console.log(
      `Indexing ${eventType} of user with id = ${userId} and studentCode = ${studentCode}.`
    )
    await eventTypeUpdaters[eventType].update(userId, studentCode)
    await events.updateLastScrapeDate(eventType, userId)
  }
}

async function updateDataFromSigarra(wishlist: Array<string>, userId: string, studentCode: string) {
  const promises = wishlist
    .filter(eventType => eventType in eventTypeUpdaters)
    .map(eventType => updateEvents(eventType, userId, studentCode))
  await Promise.all(promises)
}

function allEventTypes() {
  return [EventType.CUSTOM, EventType.EXAM, EventType.PUBLIC, EventType.TIMETABLE]
}

function validateWishList(
  wishlist: any,
  normalize: (wish: string) => string,
  isValid: (wish: string) => boolean,
  all: () => Array<string>
) {
  if (wishlist == undefined) return all()

  let wishes: Array<string>
  let result: Array<string> = []

  if (typeof wishlist === 'object') wishes = wishlist
  else wishes = [wishlist]

  for (const wish of wishes) {
    if (typeof wish === 'string' && isValid(normalize(wish))) result.push(normalize(wish))
  }

  return result.length > 0 ? result : all() // if no valid wish, then return all events
}

function validateRequestWishList(req: Request) {
  return validateWishList(
    req.query.wishlist,
    v => v.toUpperCase(),
    v => v in EventType,
    allEventTypes
  )
}

function getStartEndDates(query: any) {
  let startDate
  if (query.startDate == null) {
    const today = new Date()
    startDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  } else {
    startDate = query.startDate.toString()
  }
  const endDate = query.endDate == null ? null : query.endDate.toString()

  return [startDate, endDate]
}

function sendUnknownError(res: Response) {
  res.status(500).send({ message: 'Something went wrong. Try again!' })
}

function sendGetResponse(res: Response, retval: any) {
  if (retval !== false) {
    res.status(200).send(retval)
  } else sendUnknownError(res)
}

async function getCalendarEvents(req: Request, res: Response) {
  const wishlist = validateRequestWishList(req)
  const eventWishlist = validateWishList(
    req.query.eventWishlist,
    v => v.toLowerCase(),
    v => eventParameters.findIndex(v1 => v1 === v) !== -1,
    () => eventParameters
  )

  await updateDataFromSigarra(wishlist, req.body.id, req.query.studentCode as string)
  const [startDate, endDate] = getStartEndDates(req.query)

  const retval = await events.getCalendarEvents(
    req.body.id,
    startDate,
    endDate,
    wishlist,
    eventWishlist
  )
  sendGetResponse(res, retval)
}

async function getCalendarPublicEvents(req: Request, res: Response) {
  const [startDate, endDate] = getStartEndDates(req.query)
  // TODO public events don't need user id (create new table)
  const retval = await events.getCalendarEvents(
    req.body.id,
    startDate,
    endDate,
    [EventType.PUBLIC],
    eventParameters
  )
  sendGetResponse(res, retval)
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
    res.status(400).send({ message: 'Invalid request!' })
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
    type: EventType.CUSTOM,
  }

  const retval = await events.createEvent(new_event)

  if (retval != false) {
    const eventId = retval
    const data = await events.createEventRelation(eventId, req.body.id)
    if (data) {
      res.status(201).send({ message: 'Success!' })
    } else {
      sendUnknownError(res)
    }
  } else {
    sendUnknownError(res)
  }
}

async function deleteCalendarEvent(req: Request, res: Response) {
  if (req.params.id == null) {
    console.log(req)
    res.status(400).send({ linesDeleted: 0, message: 'Invalid request syntax, missing id parameter!' })
    return
  }

  const retval = await events.deleteEvent(req.params.id as string, req.body.id as string)
  res.status(200).send(retval)
}

async function updateCalendarEvent(req: Request, res: Response) {}

export default {
  getCalendarEvents,
  addCalendarEvent,
  getCalendarPublicEvents,
  validateRequestWishList,
  EventType,
  deleteCalendarEvent,
  updateCalendarEvent,
}
