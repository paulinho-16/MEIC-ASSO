import express from 'express'

import controller from '@/controller/meals.controller'

const router = express.Router()

/**
 * @swagger
 * /meals/{restaurant}:
 *  get:
 *    summary: Get restaurant meals
*/
router.get('/:restaurant', controller.getRestaurantMeals)

export default router
