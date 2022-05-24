import express from 'express'

import controller from '@/controller/schedule.controller'

const router = express.Router()

/**
 * @swagger
 * /schedule/student:
 *   get:
 *     summary: Fetch the current student schedule.
 *     parameters:
 *       - in: query
 *         name: pv_fest_id
 *         required: true
 *         description: Sigarra student ID. It's possible that this parameter will be removed on the future, but the endpoint's behavior will not change from this removal.
 *     responses:
 *       '200':
 *         description: The student's current schedule.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scheduleTable:
 *                    type: array
 *                    items:
 *                        type: object
 *                        properties:
 *                            dayOfTheWeek: string
 *                            startTime: string
 *                            endTime: string
 *                            curricularUnitName: string
 *                            classType: string
 *                            class: string
 *                            professors: string
 *                            room: string
 *             example:
 *               scheduleTable:
 *                 - dayOfTheWeek: Wednesday
 *                   startTime: '09:00'
 *                   endTime: '10:30'
 *                   curricularUnitName: CPM
 *                   classType: TP
 *                   class: 1MEIC01
 *                   professors: APM
 *                   room: B229
 *                 - dayOfTheWeek: Friday
 *                   startTime: '15:00'
 *                   endTime: '16:30'
 *                   curricularUnitName: CPM
 *                   classType: TP
 *                   class: 1MEIC01
 *                   professors: APM
 *                   room: B222
 *       '500':
 *         description: Unexpected error
 */
router.get('/student', controller.getStudentSchedule)

export default router
