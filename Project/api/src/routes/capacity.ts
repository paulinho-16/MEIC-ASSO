import express from 'express'

import controller from '../controller/capacity.controller'

const router = express.Router()

/**
 * @swagger
 * /capacity:
 *     get:
 *       tags:
 *         - Capacity
 *       summary: Get car parks capacity live
 *       responses:
 *         '200':
 *           description: Successful 
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   p1lotacao:
 *                     type: integer
 *                     example: 525
 *                   p3lotacao:
 *                     type: integer
 *                     example: 325
 *                   p4lotacao:
 *                     type: integer
 *                     example: 50
 *                   data:
 *                     type: string
 *                     example: "20220524"
 *                   P1in:
 *                     type: integer
 *                     example: 395
 *                   P1out:
 *                     type: integer
 *                     example: 525
 *                   P3in:
 *                     type: integer
 *                     example: 47
 *                   P3out:
 *                     type: integer
 *                     example: 41
 *                   P4in:
 *                     type: integer
 *                     example: 525
 *                   P4out:
 *                     type: integer
 *                     example: 235
 *                   p1ocupados:
 *                     type: integer
 *                     example: 160
 *                   p3ocupados:
 *                     type: integer
 *                     example: 145
 *                   p4ocupados:
 *                     type: integer
 *                     example: 6
 *                   p1livres:
 *                     type: integer
 *                     example: 365
 *                   p3livres:
 *                     type: integer
 *                     example: 180
 *                   p4livres:
 *                     type: integer
 *                     example: 44
 *         '500':
 *           description: Internal error
*/
router.get('/', controller.getCapacity)


export default router
