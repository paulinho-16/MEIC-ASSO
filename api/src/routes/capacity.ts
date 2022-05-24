import express from 'express'

import controller from '../controller/capacity.controller'

const router = express.Router()

/**
 * @swagger
 * /capacity:
 *     get:
 *       tags:
 *         - capacity
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
 *                     type: int
 *                     example: 525
 *                   p3lotacao:
 *                     type: int
 *                     example: 325
 *                   p4lotacao:
 *                     type: int
 *                     example: 50
 *                   data:
 *                     type: string
 *                     example: "20220524"
 *                   P1in:
 *                     type: int
 *                     example: 395
 *                   P1out:
 *                     type: int
 *                     example: 525
 *                   P3in:
 *                     type: int
 *                     example: 47
 *                   P3out:
 *                     type: int
 *                     example: 41
 *                   P4in:
 *                     type: int
 *                     example: 525
 *                   P4out:
 *                     type: int
 *                     example: 235
 *                   p1ocupados:
 *                     type: int
 *                     example: 160
 *                   p3ocupados:
 *                     type: int
 *                     example: 145
 *                   p4ocupados:
 *                     type: int
 *                     example: 6
 *                   p1livres:
 *                     type: int
 *                     example: 365
 *                   p3livres:
 *                     type: int
 *                     example: 180
 *                   p4livres:
 *                     type: int
 *                     example: 44
 *         '500':
 *           description: Internal error
*/
router.get('/', controller.getCapacity)


export default router
