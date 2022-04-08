import { Request, Response } from 'express'

import mealsService from '@/services/meals'

async function getRestaurantMeals(req: Request, res: Response) {
  const { restaurant } = req.params
  let code

  switch (restaurant) {
    case "grill":
      code = [2]
      break
    case "cafeteria":
      code = [4]
      break
    case "inegi":
      code = [5]
      break
    case "canteen":
      code = [6, 7]
      break
    case "inesctec":
      code = [8]
      break
    default:
      return res.status(404).send("Unknown restaurant")
  }

  try {
    const grill = await mealsService.fetchMealsData(code)
    return res.status(200).json(grill)
  } catch ({message}) {
    return res.status(503).send(message)
  }
}

export default {
  getRestaurantMeals,
}
