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
 * /calendar/event:
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
 *                 example: "weekly"
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
router.post('/event', auth.verifySessionToken, controller.addCalendarEvent)

/**
 * @swagger
 * /calendar/event/{id}:
 *   delete:
 *     tags:
 *       - calendar
 *     description: Edit a calendar event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
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
 *                   example: "Invalid parameters and values size!"
 *       401:
 *         description: User is not authorized to delete the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No event with id = 1 associated with logged in user!"
 *       403:
 *         description: User is trying to delete an event that comes from another service (SIGARRA)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event with id = 1 cannot be removed or edited!"
 *       404:
 *         description: Event with the provided id was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "There is no event with id = 1"
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rowsUpdated:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Something went wrong. Try again!"
 */
router.delete('/event/:id', auth.verifySessionToken, controller.deleteCalendarEvent)

/**
 * @swagger
 * /calendar/event/{id}:
 *   put:
 *     tags:
 *       - calendar
 *     description: Edit a calendar event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       description: Parameters to edit and respective values
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
 *                 example: "weekly"
 *     responses:
 *       200:
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
 *                   example: "Invalid parameters and values size!"
 *       401:
 *         description: User is not authorized to edit the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No event with id = 1 associated with logged in user!"
 *       403:
 *         description: User is trying to edit an event that comes from another service (SIGARRA)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event with id = 1 cannot be removed or edited!"
 *       404:
 *         description: Event with the provided id was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "There is no event with id = 1"
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rowsUpdated:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Something went wrong. Try again!"
 */
router.put('/event/:id', auth.verifySessionToken, controller.updateCalendarEvent)

export default router
