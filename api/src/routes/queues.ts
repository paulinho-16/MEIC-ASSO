import express from 'express'

import controller from '../controller/queues.controller'

const router = express.Router()


/**
 * @swagger
 * /queue:
 *     post:
 *       tags:
 *         - queues
 *       summary: Add a queue status
 *       responses:
 *         '200':
 *           description: Queue updated
 *         '400':
 *           description: Bad request
 *         '500':
 *           description: Internal error
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - restaurant
 *                 - author
 *                 - value
 *               properties:
 *                 restaurant:
 *                   type: int
 *                   example: 6
 *                 author:
 *                   type: string
 *                   example: "Filipe"
 *                 value:
 *                   type: int
 *                   example: 2
 *         description: Queue information to be added
 *         required: true
*/
router.post('/', controller.postQueue)

/**
 * @swagger
 * /queue:
 *     get:
 *       tags:
 *         - queues
 *       summary: Gets a queue status for a given restaurant
 *       description: Obtain the queues' status where the restaurant ID code is required
 *       parameters:
 *         - name: restaurant
 *           in: query
 *           description: ID code of the restaurant, one of [2,4,5,6,7,8]
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Queue status received
 *         '400':
 *           description: Bad request
 *         '500':
 *           description: Internal error
*/
router.get('/', controller.getQueue)

export default router
