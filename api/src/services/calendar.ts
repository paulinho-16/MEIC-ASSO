import { Client } from 'pg'

import { Event } from '@/@types/events'

// Database Setup Methods.

const client = new Client({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

let connected = false

async function connectDatabase() {
  if (connected) {
    return true
  }

  try {
    await client.connect()
    connected = true
  } catch (err) {
    connected = false
    setTimeout(connectDatabase, 2000)
    console.log('Error connecting to db. Retrying in 1s')
  }
}

async function getCalendarEvents(userId: string, startDate: string, endDate: string) {
  let query
  if (!connectDatabase()) {
    console.log('Failed to connect to db')
    return false
  }

  if (endDate == null) {
    query = {
      text: 'SELECT summary, description, location, date, starttime, endtime, recurrence, isUni FROM EventUsers INNER JOIN Events ON id = eventId WHERE date >= $1 AND userId = $2',
      values: [startDate, userId],
    }
  } else {
    query = {
      text: 'SELECT summary, description, location, date, starttime, endtime, recurrence, isUni FROM EventUsers INNER JOIN Events ON id = eventId WHERE date >= $1 AND date <= $2 AND userId = $3',
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

  if (!connectDatabase()) {
    return false
  }
  let query = {
    text: 'INSERT INTO Events(summary, description, location, date, startTime, endTime, recurrence, isUni) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    values: [
      event.summary,
      event.description,
      event.location,
      event.date,
      event.startTime,
      event.endTime,
      event.recurrence,
      event.isUni,
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

  if (!connectDatabase()) {
    return false
  }
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

async function deleteEvent(eventId: string, userId: string) {
  console.log('Deleting event')

  if (!connectDatabase()) {
    return { linesDeleted: 0, message: 'Error connecting to database!' }
  }

  let verifyUserQuery = {
    text: 'SELECT * FROM EventUsers WHERE eventId=$1 AND userId=$2',
    values: [eventId, userId],
  }

  try {
    let res = await client.query(verifyUserQuery)
    if (res.rowCount == 0)
      return { linesDeleted: 0, message: `No event wit id = ${eventId} associated with logged in user!` }
  } catch (err) {
    console.log(err)
    return { linesDeleted: 0, message: 'Error executing query...' }
  }

  let query = {
    text: 'DELETE FROM Events WHERE id=$1',
    values: [eventId],
  }

  try {
    let res = await client.query(query)
    return {
      linesDeleted: res.rowCount,
      message: res.rowCount > 0 ? 'Deleted successfully' : `There is no event with id = ${eventId}`,
    }
  } catch (err) {
    console.log(err)
    return { linesDeleted: 0, message: 'Error executing query...' }
  }
}

export default {
  createEvent,
  getCalendarEvents,
  createEventRelation,
  deleteEvent,
}
