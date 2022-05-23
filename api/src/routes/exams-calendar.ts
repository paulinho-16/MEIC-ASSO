import express from 'express'

import controller from '@/controller/exams-calendar.controller'

const router = express.Router()

/**
 * @swagger
 * /exams-calendar/{courseID}:
 *   get:
 *     summary: Retrieve courseID exams calendar
 *     parameters:
 *       - in: path
 *         name: courseID
 *         required: true
 *         description: course ID
 *     responses:
 *       200:
 *         description: The request was made with a valid course ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course: 
 *                   type: string
 *                 seasons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name: 
 *                         type: string
 *                       exams:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             acronym: 
 *                               type: string
 *                             url: 
 *                               type: string
 *                             day: 
 *                               type: string
 *                             begin:
 *                               type: string
 *                             duration:
 *                               type: string
 *                             rooms:
 *                               type: string
 *       500:
 *         description: Unexpected error
*/

router.get('/:id', controller.get)

export default router