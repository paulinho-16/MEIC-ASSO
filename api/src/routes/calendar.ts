import express from 'express'

import controller from '@/controller/calendar.controller'
import auth from '@/middleware/auth'
import calendarMiddleware from '@/middleware/calendar'

const router = express.Router()

/**
 * @swagger
 * /calendar:
 *   get:
 *     tags:
 *       - calendar
 *     summary: Get the calendar events
 *     parameters:
 *       - in: query
 *         name: wishlist
 *         required: false
 *         schema:
 *           type: array
 *         description: Retrieve only the specified types of events. Array of strings. Supported types of events are TIMETABLE (from the SIGARRA schedule), CUSTOM (created by the user) and EXAM (from the user's SIGARRA exam calendar). Defaults to all types
 *       - in: query
 *         name: eventWishlist
 *         required: false
 *         schema:
 *           type: array
 *         description: Retrieve only the specified fields of each event. Array of strings. The supported fields are listed in the response example. Defaults to all fields
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *         description: Retrieve events after startDate. String in format YYYY-MM-DD. Defaults to today
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *         description: Retrieve events before endDate. String in format YYYY-MM-DD. Defaults to null
 *       - in: query
 *         name: studentCode
 *         required: false
 *         schema:
 *           type: string
 *         description: SIGARRA code of the user (used for retrieving the exams events). Required for retrieving EXAM type events. Example - 2018XXXXX (without up)
 *     responses:
 *       200:
 *         description: The request made was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: int
 *                     example: "1"
 *                   summary:
 *                     type: string
 *                     example: "CPM"
 *                   description:
 *                     type: string
 *                     example: "Tuesday TP 1MEIC01 APM"
 *                   location:
 *                     type: string
 *                     example: "B229"
 *                   date:
 *                     type: string
 *                     example: "2022-05-17T00:00:00.000Z"
 *                   starttime:
 *                     type: string
 *                     example: "2022-05-17T09:00:00.000Z"
 *                   endtime:
 *                     type: string
 *                     example: "2022-05-17T10:30:00.000Z"
 *                   recurrence:
 *                     type: string
 *                     example: "weekly"
 *                   type:
 *                     type: string
 *                     example: "TIMETABLE"
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong. Try again!"
 */
router.get(
  '/',
  calendarMiddleware.verifyCalendarRequest,
  auth.verifySessionToken,
  controller.getCalendarEvents
)

/**
 * @swagger
 * /calendar/create:
 *   post:
 *     tags:
 *       - calendar
 *     description: Add a calendar event
 *     requestBody:
 *       description: Event info
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *                 example: "A summary"
 *               description:
 *                 type: string
 *                 example: "A description"
 *               location:
 *                 type: string
 *                 example: "Room B101"
 *               date:
 *                 type: string
 *                 example: "2022-05-22"
 *               startTime:
 *                 type: string
 *                 example: "13:00:00"
 *               endTime:
 *                 type: string
 *                 example: "15:00:00"
 *               recurrence:
 *                 type: string
 *                 example: TBD
 *     responses:
 *       201:
 *         description: Successfully added event to calendar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *       400:
 *         description: One of the parameters is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid syntax!"
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong. Try again!"
 */
router.post('/create', auth.verifySessionToken, controller.addCalendarEvent)

/**
 * @swagger
 * /calendar/google-calendar-token:
 *   get:
 *     tags:
 *       - calendar
 *     summary: Generate an authentication token in the Google Calendar API
 *     parameters:
 *       - in: header
 *         name: code
 *         required: false
 *         type: string
 *         description: Code generated by google. This route will be called automatically after the user has authorized the app.
 *     responses:
 *       200:
 *         description: The request made was successful. If the request includes the code parameter, the response will include the access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 scope:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                   example: "Bearer"
 *                 expiry date:
 *                   type: int
*/
router.get('/google-calendar-token', auth.verifySessionToken, controller.getGCToken)

/**
 * @swagger
 * /calendar/exportgc:
 *   post:
 *     tags:
 *       - calendar
 *     description: Export all future calendar events to Google Calendar
 *     requestBody:
 *       description: Google Calendar Token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gctoken:
 *                 type: string
 *                 example: A Google Calendar Token
 *     responses:
 *       200:
 *         description: Successfully exported events to Google Calendar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong. Try again!"
 */
router.post('/exportgc', auth.verifySessionToken, controller.exportToGC)

export default router
