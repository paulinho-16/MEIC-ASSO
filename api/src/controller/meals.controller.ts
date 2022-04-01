import { Request, Response } from 'express'

import mealsService from '@/services/meals'

async function getCanteen(req: Request, res: Response) {
  const data = await mealsService.fetchMealsData()

  const canteen = data.filter(meal => meal.code === 6 || meal.code === 7)

  return res.status(200).json(canteen)
}

async function getGrill(req: Request, res: Response) {
  const data = await mealsService.fetchMealsData()

  const grill = data.filter(meal => meal.code === 2)

  return res.status(200).json(grill)
}

async function getCafeteria(req: Request, res: Response) {
  const data = await mealsService.fetchMealsData()

  const cafeteria = data.filter(meal => meal.code === 4)

  return res.status(200).json(cafeteria)
}

async function getInegi(req: Request, res: Response) {
  const data = await mealsService.fetchMealsData()

  const inegi = data.filter(meal => meal.code === 5)

  return res.status(200).json(inegi)
}

async function getInesc(req: Request, res: Response) {
  const data = await mealsService.fetchMealsData()

  const inesc = data.filter(meal => meal.code === 8)

  return res.status(200).json(inesc)
}

export default {
  getCanteen,
  getGrill,
  getCafeteria,
  getInegi,
  getInesc,
}
