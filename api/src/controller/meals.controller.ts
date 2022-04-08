import { Request, Response } from 'express'

import mealsService from '@/services/meals'

async function getCanteen(req: Request, res: Response) {
  const canteen = await mealsService.fetchMealsData([6, 7])

  return res.status(200).json(canteen)
}

async function getGrill(req: Request, res: Response) {
  const grill = await mealsService.fetchMealsData([2])

  return res.status(200).json(grill)
}

async function getCafeteria(req: Request, res: Response) {
  const cafeteria = await mealsService.fetchMealsData([4])

  return res.status(200).json(cafeteria)
}

async function getInegi(req: Request, res: Response) {
  const inegi = await mealsService.fetchMealsData([5])

  return res.status(200).json(inegi)
}

async function getInescTec(req: Request, res: Response) {
  const inesc = await mealsService.fetchMealsData([8])

  return res.status(200).json(inesc)
}

export default {
  getCanteen,
  getGrill,
  getCafeteria,
  getInegi,
  getInescTec,
}
