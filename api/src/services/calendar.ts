import client from '@/util/connect-postgres'

import { Event } from '@/@types/events'
import { QueryResult } from 'pg'

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

function getSelectFields(fields: Array<string>): string {
  return fields.join(', ')
}

async function getCalendarEvents(
  userId: string,
  startDate: string,
  endDate: string,
  eventTypes: Array<string>,
  eventWishlist: Array<string>
) {
  let query

  const eventTypeCondition = getEventTypeCondition(eventTypes)
  const selectFields = getSelectFields(eventWishlist)

  if (endDate == null) {
    query = {
      text: `SELECT ${selectFields}
             FROM EventUsers INNER JOIN Events ON id = eventId
             WHERE date >= $1 AND userId = $2 AND ${eventTypeCondition}`,
      values: [startDate, userId],
    }
  } else {
    query = {
      text: `SELECT ${selectFields}
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

async function verifyEventType(res: QueryResult) {
  return res.rows[0].type == 'CUSTOM'
}

async function verifyEventUser(eventId: string, userId: string) {
  let verifyUserQuery = {
    text: 'SELECT type FROM EventUsers INNER JOIN Events ON id = eventId WHERE eventId=$1 AND userId=$2',
    values: [eventId, userId],
  }

  try {
    let res = await client.query(verifyUserQuery)
    if (res.rowCount == 0) return null
    return res
  } catch (err) {
    console.log(err)
    return null
  }
}

async function verifyEventTypeAndUser(eventId: string, userId: string, update: boolean) {
  const res = await verifyEventUser(eventId, userId)
  const rowsKey = `rows${update ? "Updated" : "Deleted"}`
  if (res == null)
    return {
      [rowsKey]: 0,
      message: `No event wit id = ${eventId} associated with logged in user!`,
    }

  if (!verifyEventType(res))
    return {
      [rowsKey]: 0,
      message: `Event wit id = ${eventId} cannot be removed!`,
    }
}

async function updateEvent(eventId: string, userId: string, parameters: Array<string>, values: Array<string>) {
  if (parameters.length != values.length || parameters.length == 0) {
    return {
      rowsUpdated: 0,
      message: 'Invalid parameters and values size!',
    }
  }

  const ret = verifyEventTypeAndUser(eventId, userId, true) 
  if (ret) return ret 

  values.push(eventId)
  let updateValues = ''
  for (const i in parameters) {
    updateValues += `${parameters[i]} = $${Number(i) + 1}, `
  }
  updateValues = updateValues.substring(0, updateValues.length - 2)

  const query = {
    text: `UPDATE Events 
          SET ${updateValues}
          WHERE id = $${values.length}`,
    values: values,
  }

  try {
    let res = await client.query(query)
    return {
      rowsUpdated: res.rowCount,
      message: res.rowCount > 0 ? 'Updated successfully' : `There is no event with id = ${eventId}`,
    }
  } catch (err) {
    console.log(err)
    return { rowsUpdated: 0, message: 'Error executing query...' }
  }
}

async function deleteEvent(eventId: string, userId: string) {
  console.log('Deleting event')

  const ret = verifyEventTypeAndUser(eventId, userId, false)
  if (ret) return ret 

  let query = {
    text: 'DELETE FROM Events WHERE id=$1',
    values: [eventId],
  }

  try {
    let res = await client.query(query)
    return {
      rowsDeleted: res.rowCount,
      message: res.rowCount > 0 ? 'Deleted successfully' : `There is no event with id = ${eventId}`,
    }
  } catch (err) {
    console.log(err)
    return { rowsDeleted: 0, message: 'Error executing query...' }
  }
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
  deleteEvent,
  deleteAllEvents,
  updateEvent,
}
