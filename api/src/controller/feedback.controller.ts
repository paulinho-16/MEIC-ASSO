import { Request, Response } from 'express'

import fb from '@/services/feedback'

import {
  MealReview,
  TeacherReview,
} from '@/@types/reviews'

async function get(req: Request, res: Response) {
  const data = fb.getFeedback(2)
  res.send('Feedback route')
}

async function postMealReview(req: Request, res: Response) {
  const data = fb.postMealReview()
  res.send('Feedback route')
}

async function postTeacherReview(req: Request, res: Response) {
  const data = fb.postTeacherReview()
  res.send('Feedback route')
}

export default {
  get,
  postMealReview,
  postTeacherReview
}
