import { Request, Response } from 'express'

import mealsService from '@/services/meals'

async function getCanteen(req: Request, res: Response) {
  const data = await mealsService.fetchCanteenData()

  return res.status(200).json(data)
}

export default {
  getCanteen,
}
