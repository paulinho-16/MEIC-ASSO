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
    date: query.date == null ? new Date() : new Date(query.date.toString()),
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
  const query = req.query
  const review: MealReview = {
    description: query.description.toString() == '' ? null : query.description.toString(),
    author: query.author.toString() == '' ? null : query.author.toString(),
    date: query.date.toString() == '' ? null : new Date(query.date.toString()),
    establishment: query.establishment.toString() == '' ? null : query.establishment.toString(),
    dish: query.dish.toString() == '' ? null : query.dish.toString(),
    rating: query.rating.toString() == '' ? null : parseFloat(query.rating.toString())
  }
  const data = fb.getMealReview(review)
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
