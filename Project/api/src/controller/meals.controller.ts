import { Request, Response } from 'express'

import mealsService from '@/services/meals'

async function getRestaurantMeals(req: Request, res: Response) {
  const { restaurant } = req.params
  let code

  switch (restaurant) {
    case 'grill':
      code = [2]
      break
    case 'cafeteria':
      code = [4]
      break
    case 'inegi':
      code = [5]
      break
    case 'canteen':
      code = [6, 7]
      break
    case 'inesctec':
      code = [8]
      break
    default:
      return res.status(404).json({ error: 'Unknown restaurant' })
  }

  try {
    const meals = await mealsService.fetchMealsData(code)
    return res.status(200).json(meals)
  } catch ({ message }) {
    return res.status(503).json({ error: message })
  }
}

export default {
  getRestaurantMeals,
}
