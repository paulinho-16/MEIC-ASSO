import express from 'express'

import controller from '@/controller/calendar.controller'
import auth from '@/middleware/auth'


const router = express.Router()

/**
 * @swagger
 * /calendar:
 *   get:
 *     summary: Get the calendar events
 *     parameters:
 *       - in: header
 *         name: startDate
 *         required: false
 *         type: string
 *         description: retrieve events after startDate. String in format YYYY-MM-DD. Defaults to today
 *       - in: header
 *         name: endDate
 *         required: false
 *         type: string
 *         description: retrieve events before endDate. String in format YYYY-MM-DD. Defaults to null
 *     responses:
 *       201:
 *         description: The request made was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   example: []
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
router.get('/', auth.verifySessionToken, controller.getCalendarEvents)

/**
 * @swagger
 * /calendar/create:
 *   post:
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

export default router