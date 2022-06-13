import { Request, Response } from 'express'

import paymentsService from '@/services/payments'

async function get(req: Request, res: Response) {
  const payments = await paymentsService.fetchPayments(req.body)

  return res.status(200).json(payments)
}

export default {
  get,
}