import { Request, Response } from 'express'

import queue_service from '@/services/queues'

import {
  Queue,
} from '@/@types/queues'

async function postQueue(req: Request, res: Response) {
  const query = req.body

  if(query.restaurant == undefined || query.author == undefined || query.value == undefined) {
    res.status(400).send('This request must have \'restaurant\', \'author\', and \'value\'.')
    return
  }

  if(query.author == '') {
    res.status(400).send('\'author\' can\'t be an empty string.')
    return
  }

  if(isNaN(parseInt(query.value.toString()))){
    res.status(400).send('Value must be a integer.')
    return
  }

  if(isNaN(parseInt(query.restaurant.toString()))){
    res.status(400).send('Restaurant must be a integer.')
    return
  }

  if([2,4,5,6,7,8].indexOf(parseInt(query.restaurant.toString())) == -1){
    res.status(400).send('Restaurant must be one of [2,4,5,6,7,8].')
    return
  }

  if(parseInt(query.value.toString()) > 5 || parseInt(query.value.toString()) < 0) {
    res.status(400).send('Value must be between 0 and 5.')
    return
  }

  const queue: Queue = {
    restaurant: query.restaurant.toString(),
    author: query.author.toString(),
    value: query.value.toString()
  }

  const data = await queue_service.postQueue(queue)
  if(data){
    res.send('Success')
  }
  else{
    res.status(500).send('Something went wrong. Try again!')
  }
}

async function getQueue(req: Request, res: Response) {
  const query = req.query

  if(query.restaurant == undefined ) {
    res.status(400).send('This request must have \'restaurant\'.')
    return
  }

  if(isNaN(parseInt(query.restaurant.toString()))){
    res.status(400).send('Restaurant must be a integer.')
    return
  }
  let restaurant = parseInt(query.restaurant.toString())

  if([2,4,5,6,7,8].indexOf(restaurant) == -1){
    res.status(400).send('Restaurant must be one of [2,4,5,6,7,8].')
    return
  }

  const data = await queue_service.getQueue(restaurant)
  if(data){
    res.json(data)
  }
  else{
    res.status(500).send('Something went wrong. Try again!')
  }
}

export default {
  postQueue,
  getQueue
}
