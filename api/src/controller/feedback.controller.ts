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
  const query = req.query
  const review: MealReview = {
    description: query.description.toString(),
    author: query.author.toString(),
    date: new Date(),
    establishment: query.establishment.toString(),
    dish: query.dish.toString(),
    rating: parseFloat(query.rating.toString())
  }
  const data = fb.postMealReview(review)
  res.send('Feedback route')
}

async function postTeacherReview(req: Request, res: Response) {
  const data = fb.postTeacherReview()
  res.send('Feedback route')
}

async function getMealReview(req: Request, res: Response) {
  const data = fb.getMealReview()
  res.send('Feedback route')
}

async function getTeacherReview(req: Request, res: Response) {
  const data = fb.getTeacherReview()
  res.send('Feedback route')
}

export default {
  get,
  postMealReview,
  postTeacherReview,
  getMealReview,
  getTeacherReview
}
