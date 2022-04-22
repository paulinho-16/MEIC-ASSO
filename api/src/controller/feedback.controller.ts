import { Request, Response } from 'express'

import fb from '@/services/feedback'

import {
  MealReview,
  TeacherReview,
} from '@/@types/reviews'

// async function get(req: Request, res: Response) {
//   const data = fb.getFeedback(2)
//   res.send('Feedback route')
// }

async function postMealReview(req: Request, res: Response) {
  const query = req.query

  if(query.description == undefined || query.author == undefined || query.establishment == undefined || query.dish == undefined || query.rating == undefined) {
    res.status(400).send('This request must have \'description\', \'author\', \'establishment\', \'dish\' and \'rating\'.')
    return
  }

  if(query.author == '' || query.establishment == '' || query.dish == '' || query.rating == '') {
    res.status(400).send('\'author\', \'establishment\', \'dish\' and \'rating\' can\'t be empty strings.')
    return
  }

  if(isNaN(parseInt(query.rating.toString()))){
    res.status(400).send('Rating must be a integer.')
    return
  }

  if(parseInt(query.rating.toString()) > 5 || parseInt(query.rating.toString()) < 0) {
    res.status(400).send('Rating must be between 0 and 5.')
    return
  }

  const review: MealReview = {
    description: query.description.toString(),
    author: query.author.toString(),
    date: new Date(),
    establishment: query.establishment.toString(),
    dish: query.dish.toString(),
    rating: parseInt(query.rating.toString())
  }
  const data = await fb.postMealReview(review)
  if(data){
    res.json(data)
  }
  else{
    res.status(500).send('Something went wrong. Try again!')
  }
}

async function postTeacherReview(req: Request, res: Response) {
  const data = fb.postTeacherReview()
  res.send('Feedback route')
}

async function getMealReview(req: Request, res: Response) {
  const query = req.query

  if(query.description == undefined || query.author == undefined || query.date == undefined || query.establishment == undefined || query.dish == undefined || query.rating == undefined) {
    res.status(400).send('This request must have \'description\', \'author\', \'date\', \'establishment\', \'dish\' and \'rating\'.')
    return
  }

  if(query.rating.toString() != '' && parseInt(query.rating.toString())){
    res.status(400).send('Rating must be a integer.')
    return
  }

  const review: MealReview = {
    description: query.description.toString() == '' ? null : query.description.toString(),
    author: query.author.toString() == '' ? null : query.author.toString(),
    date: query.date.toString() == '' ? null : new Date(query.date.toString()),
    establishment: query.establishment.toString() == '' ? null : query.establishment.toString(),
    dish: query.dish.toString() == '' ? null : query.dish.toString(),
    rating: query.rating.toString() == '' ? null : parseInt(query.rating.toString())
  }
  const data = await fb.getMealReview(review)
  if(data){
    res.json(data)
  }
  else{
    res.status(500).send('Something went wrong. Try again!')
  }
}

async function getTeacherReview(req: Request, res: Response) {
  const data = fb.getTeacherReview()
  res.send('Feedback route')
}

export default {
  //get,
  postMealReview,
  postTeacherReview,
  getMealReview,
  getTeacherReview
}
