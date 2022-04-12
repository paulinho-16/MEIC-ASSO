import { Request, Response } from 'express'

import feedbackService from '../services/feedback'

async function get(req: Request, res: Response) {
  const data = feedbackService.getFeedback()
  res.send('Feedback route')
}

async function post(req: Request, res: Response) {
  const data = feedbackService.sendFeedback()
  res.send('Feedback route')
}

export default {
  get,
  post
}
