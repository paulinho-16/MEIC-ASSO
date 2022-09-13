import express from 'express'

import controller from '@/controller/schedule.controller'

import constants from '@/config/constants'

const router = express.Router()

/**
 * @swagger
 * /schedule/{studentNumber}:
 *   get:
 *     summary: Fetch the current student schedule.
 *     tags:
 *       - Schedule
 *     parameters:
 *       - in: path
 *         name: studentNumber
 *         required: true
 *         description: Sigarra student ID.
 *     responses:
 *       '200':
 *         description: The student's current schedule.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scheduleTable:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dayOfTheWeek:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                       endTime:
 *                         type: string
 *                       curricularUnitName:
 *                         type: string
 *                       classType:
 *                         type: string
 *                       class:
 *                         type: string
 *                       professors:
 *                         type: string
 *                       room:
 *                         type: string
 *                 weekBlock:
 *                   type: object
 *                   properties:
 *                     blockStartDate:
 *                       type: string
 *                     blockEndDate:
 *                       type: string
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
 *               weekBlock:
 *                 blockStartDate: '27-02-2022'
 *                 blockEndDate: '11-06-2022'
 *       '500':
 *         description: Unexpected error
 */
router.get('/:studentNumber', controller.getStudentSchedule)

/**
 * @swagger
 * /schedule/{studentNumber}/url:
 *   get:
 *     summary: Fetch URL necessary to retrieve current student schedule
 *     tags:
 *       - Schedule
 *     parameters:
 *       - in: path
 *         name: studentNumber
 *         required: true
 *         description: Sigarra student ID.
 *     responses:
 *       200:
 *         description: The URL necessary to retrieve current student schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               https://sigarra.up.pt/feup/pt/hor_geral.estudantes_view=201800000
 *       500:
 *         description: Unexpected error
 */
 router.route('/:studentNumber/url')
 .get(function (req, res) {
     res.status(200).send(`${constants.studentSchedulePageBaseUrl}=`+req.params.studentNumber);
});

export default router
