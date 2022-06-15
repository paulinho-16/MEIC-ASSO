import express from 'express'

import controller from '@/controller/meals.controller'

const router = express.Router()

/**
 * @swagger
 * /meals/{restaurant}:
 *  get:
 *    summary: Get restaurant meals
 *    tags:
 *       - Meals
 *    parameters:
 *       - in: path
 *         name: restaurant
 *         required: true
 *         description: Name of Restaurant.
 *    responses:
 *       200:
 *         description: The student's current schedule.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 description:
 *                   type: string
 *                 schedule:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                     end:
 *                       type: string
 *                 menus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       state:
 *                         type: string
 *                       date:
 *                         type: string
 *                       meals:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             state:
 *                               type: string
 *                             description:
 *                               type: string
 *                             type:
 *                               type: string
 *                             
 *             example:
 *               code: 2
 *               description: Grill
 *               schedule: 
 *                 start: "12h00"
 *                 end: "14h00"
 *               menus:
 *                 - state: Aberto
 *                   date: '15-06-2022'
 *                   meals: 
 *                     - state: Aberto
 *                       description: Lasanha de Carne
 *                       type: Carne
 *                     - state: Aberto
 *                       description: Carapau grelhado com molho verde e batata cozida
 *                       type: Peixe
 *                     - state: Aberto
 *                       description: Paella com seitan
 *                       type: Vegetariano
 *                 - state: Aberto
 *                   date: '17-06-2022'
 *                   meals: 
 *                     - state: Aberto
 *                       description: Francesinha
 *                       type: Carne
 *                     - state: Aberto
 *                       description: Feijoada de marisco
 *                       type: Peixe
 *                     - state: Aberto
 *                       description: Macarrão com feijão catarino, lentilhas e cenoura
 *                       type: Vegetariano
 *       404:
 *         description: That restaurant is unknown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unknown restaurant"
 *       500:
 *         description: Unexpected error
 *       503:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
*/
router.get('/:restaurant', controller.getRestaurantMeals)

export default router
