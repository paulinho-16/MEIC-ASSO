import express from 'express'

import controller from '@/controller/meals.controller'

const router = express.Router()

router.get('/:restaurant', controller.getRestaurantMeals)

export default router
