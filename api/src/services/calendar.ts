import client from '@/util/connect-postgres'

import { Event } from '@/@types/events'

async function eventExists(startTime: Date, endTime: Date, summary: string, date: Date) {
  let query = {
    text: 'SELECT id FROM Events WHERE startTime = $1 AND endTime = $2 AND summary = $3 AND date = $4',
    values: [startTime, endTime, summary, date],
  }

  try {
    let res = await client.query(query)
    if (res.rows.length > 0) return res.rows[0].id

    return false
  } catch (err) {
    console.log(err)
    return false
  }
}

async function eventRelationExists(userdId: string, eventId: string) {
  let query = {
    text: 'SELECT eventId FROM EventUsers WHERE userId = $1 AND eventId = $2',
    values: [userdId, eventId],
  }

  try {
    let res = await client.query(query)
    if (res.rows.length > 0) return true

    return false
  } catch (err) {
    console.log(err)
    return false
  }
}

function getEventTypeCondition(eventTypes: Array<string>): string {
  return `(${eventTypes.map(eventType => `type = '${eventType}'`).join(' OR ')})`
}

async function getCalendarEvents(
  userId: string,
  startDate: string,
  endDate: string,
  eventTypes: Array<string>
) {
  let query

  const eventTypeCondition = getEventTypeCondition(eventTypes)

  if (endDate == null) {
    query = {
      text: `SELECT summary, description, location, date, starttime, endtime, recurrence, type
             FROM EventUsers INNER JOIN Events ON id = eventId
             WHERE date >= $1 AND userId = $2 AND ${eventTypeCondition}`,
      values: [startDate, userId],
    }
  } else {
    query = {
      text: `SELECT summary, description, location, date, starttime, endtime, recurrence, type
             FROM EventUsers INNER JOIN Events ON id = eventId
             WHERE date >= $1 AND date <= $2 AND userId = $3 AND ${eventTypeCondition}`,
      values: [startDate, endDate, userId],
    }
  }

  try {
    let res = await client.query(query)
    return res.rows
  } catch (err) {
    console.log(err)
    return false
  }
}

async function createEvent(event: Event) {
  console.log('Creating event')

  let query = {
    text: 'INSERT INTO Events(summary, description, location, date, startTime, endTime, recurrence, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    values: [
      event.summary,
      event.description,
      event.location,
      event.date,
      event.startTime,
      event.endTime,
      event.recurrence,
      event.type,
    ],
  }

  try {
    let res = await client.query(query)
    return res.rows[0].id
  } catch (err) {
    console.log(err)
    return false
  }
}

async function createEventRelation(eventId: string, userId: string) {
  console.log('Creating event relation')

  const query = {
    text: 'INSERT INTO EventUsers(eventId, userId) VALUES($1, $2)',
    values: [eventId, userId],
  }

  try {
    let res = await client.query(query)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

async function getLastScrapeDate(eventType: string, userId: string) {
  let query = {
    text: 'SELECT lastScraped FROM CalendarScrapingControl WHERE userId = $1 AND eventType = $2',
    values: [userId, eventType],
  }

  try {
    let res = await client.query(query)
    if (res.rows.length > 0) return new Date(res.rows[0].lastscraped)

    return new Date('2000-01-01')
  } catch (err) {
    console.log(err)
    return false
  }
}

async function updateLastScrapeDate(eventType: string, userId: string) {
  let query = {
    text: `INSERT INTO CalendarScrapingControl(userId, eventType, lastScraped)
           VALUES($1, $2, $3) ON CONFLICT(userId, eventType)
           DO UPDATE SET lastScraped = EXCLUDED.lastScraped`,
    values: [userId, eventType, new Date()],
  }

  try {
    await client.query(query)
  } catch (err) {
    console.log(err)
    return false
  }
  return true
}

async function deleteAllEvents(userId: string, eventType: string) {
  let query = {
    text: `DELETE FROM Events WHERE id IN (SELECT id FROM Events INNER JOIN EventUsers ON(eventId = id) WHERE type = $1 and userId = $2)`,
    values: [eventType, userId],
  }

  try {
    await client.query(query)
  } catch (err) {
    console.log(err)
    return false
  }
  return true
}

export default {
  createEvent,
  getCalendarEvents,
  createEventRelation,
  eventExists,
  eventRelationExists,
  getLastScrapeDate,
  updateLastScrapeDate,
  deleteAllEvents,
}
