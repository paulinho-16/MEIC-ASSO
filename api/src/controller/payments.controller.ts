import { Request, Response } from 'express'

import { paymentsPageHTML } from '../config/data'

import paymentsService from '@/services/payments'

async function get(req: Request, res: Response) {
  const payments = await paymentsService.fetchPayments(paymentsPageHTML.toString())

  return res.status(200).json(payments)
}

export default {
  get,
}