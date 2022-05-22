import express from 'express'

import controller from '@/controller/exams-calendar.controller'

const router = express.Router()

router.get('/:id', controller.get)

/**
 * @swagger
 * /exams-calendar/{courseID}
 *  get:
 *      description: Retrieve courseID exams calendar
 *      parameters:
 *          - in: path
 *            name: courseID
 *            required: true
 *            description: course ID
 *      responseBody:
 *          description: Response
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          course: string
 *                          seasons:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      name: string
 *                                      exams:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  acronym: string
 *                                                  url: string
 *                                                  day: string
 *                                                  begin: string
 *                                                  duration: string
 *                                                  rooms: string
 */
export default router