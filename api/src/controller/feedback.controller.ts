import { Request, Response } from 'express'

import fb from '@/services/feedback'

import {
  MealReview,
  TeacherReview,
} from '@/@types/reviews'


async function postMealReview(req: Request, res: Response) {
  const query = req.query

  if(query.description == undefined || query.author == undefined || query.restaurant == undefined || query.dish == undefined || query.rating == undefined) {
    res.status(400).send('This request must have \'description\', \'author\', \'restaurant\', \'dish\' and \'rating\'.')
    return
  }

  if(query.author == '' || query.restaurant == '' || query.dish == '' || query.rating == '') {
    res.status(400).send('\'author\', \'restaurant\', \'dish\' and \'rating\' can\'t be empty strings.')
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
    restaurant: query.restaurant.toString(),
    dish: query.dish.toString(),
    rating: parseInt(query.rating.toString())
  }
  const data = await fb.postMealReview(review)
  if(data){
    res.send('Success')
  }
  else{
    res.status(500).send('Something went wrong. Try again!')
  }
}

async function postTeacherReview(req: Request, res: Response) {
  
  //const data = fb.postTeacherReview()

  const review:TeacherReview = req.body


  if(review.description == undefined || review.author == undefined || review.class == undefined || review.teacher == undefined) {
    res.status(400).send('This request must have a json with \'description\', \'author\', and \'class\'.')
    return
  }

  if(review.author == '' || review.class == '' || review.teacher == '') {
    res.status(400).send('\'author\', \'class\', \'teacher\' can\'t be empty strings.')
    return
  }

  const reviewToPost: TeacherReview = {
    description: review.description.toString(),
    author: review.author.toString(),
    date: new Date(),
    class: review.class.toString(),
    teacher: review.teacher.toString()
  }

  const data = await fb.postTeacherReview(reviewToPost)
  if (data) {
    res.send("Success")
  }
  else {
    res.status(500).send("Something went wrong. Try again!")
  }
}

async function getMealReview(req: Request, res: Response) {
  const query = req.query

  if(query.description == undefined || query.author == undefined || query.date == undefined || query.restaurant == undefined || query.dish == undefined || query.rating == undefined) {
    res.status(400).send('This request must have \'description\', \'author\', \'date\', \'restaurant\', \'dish\' and \'rating\'. If you don\'t want to include some of them in your search leave them blank.')
    return
  }

  if(query.rating.toString() != '' && isNaN(parseInt(query.rating.toString()))){
    res.status(400).send('Rating must be a integer.')
    return
  }

  if(parseInt(query.rating.toString()) > 5 || parseInt(query.rating.toString()) < 0) {
    res.status(400).send('Rating must be between 0 and 5.')
    return
  }

  const review: MealReview = {
    description: query.description.toString() == '' ? null : query.description.toString(),
    author: query.author.toString() == '' ? null : query.author.toString(),
    date: query.date.toString() == '' ? null : new Date(query.date.toString()),
    restaurant: query.restaurant.toString() == '' ? null : query.restaurant.toString(),
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
  //const data = fb.getTeacherReview()
  res.send('getTeacherReview route not implemented')
}

export default {
  //get,
  postMealReview,
  postTeacherReview,
  getMealReview,
  getTeacherReview
}
