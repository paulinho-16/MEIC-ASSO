import express from 'express'

import controller from '../controller/queues.controller'

const router = express.Router()


/**
 * @swagger
 * /queue:
 *     post:
 *       tags:
 *         - Queues
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
 *                   description: ID code of the restaurant, one of [2,4,5,6,7,8]
 *                 author:
 *                   type: string
 *                   example: "Filipe"
 *                   description: Name of the author, must be unique for each author
 *                 value:
 *                   type: int
 *                   example: 2
 *                   description: Value between 0 and 5. 0 -> no queue; 5 -> don't even try to go on this queue
 *         description: Queue information to be added
 *         required: true
*/
router.post('/', controller.postQueue)

/**
 * @swagger
 * /queue:
 *     get:
 *       tags:
 *         - Queues
 *       summary: Gets a queue status for a given restaurant
 *       description: Obtain the queues' status where the restaurant ID code is required
 *       parameters:
 *         - name: restaurant
 *           in: query
 *           description: ID code of the restaurant, one of [2,4,5,6,7,8]. 2 -> grill, 4-> cafeteria, 5-> inegi, [6,7] -> cantina FEUP, 8 -> inesctec
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Queue status received
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   average_value:
 *                     type: float
 *                     example: 4.33
 *                   last_entry_value:
 *                     type: int
 *                     example: 5
 *                   last_entry_timestamp:
 *                     type: string
 *                     example: "2022-04-22T00:00:00.000Z"
 *         '400':
 *           description: Bad request
 *         '500':
 *           description: Internal error
*/
router.get('/', controller.getQueue)

export default router
