import { Client } from 'pg'


import {
    MealReview,
    TeacherReview,
} from '@/@types/reviews'

const client = new Client({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
})

client.connect()
  .then(() => console.log('connected'))
  .catch((err) => console.error('connection error', err.stack))


function getFeedback(id:number) {
    /*
    client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
        console.log(err ? err.stack : res.rows[0].message) // Hello World!
        client.end()
    }) */
}

async function postMealReview(review:MealReview){
  console.log('post meal review')
  
  const query = {
    text: 'INSERT INTO meal_review(description, author, date, restaurant, dish, rating) VALUES($1, $2, $3, $4, $5, $6)',
    values: [review.description, review.author, review.date, review.restaurant, review.dish, review.rating],
  }

  try{
    let res = await client.query(query)
    return true
  }
  catch(err){
    console.log(err);
    return false
  }
}

async function postTeacherReview(review:TeacherReview){
  const query = {
    text: 'INSERT INTO teacher_review(description, author, date, class, teacher) VALUES($1, $2, $3, $4, $5)',
    values: [review.description, review.author, review.date, review.class, review.teacher],
  }
    
  try{
    let res = await client.query(query)
    return true
  }
  catch(err){
    console.log(err);
    return false
  }
}

async function getMealReview(review:MealReview){
  console.log('get meal reviews')
  
  let query = "SELECT * FROM meal_review"
  let values = []

  if(review.description != null || review.author != null || review.date != null || review.restaurant != null || review.dish != null || review.rating != null)  {
      
    query += " WHERE "
    let i = 0

    if(review.description != null) {
      i++
      values.push(review.description)
      query += "description=$" + i + " AND "
    }

    if(review.author != null){
      i++
      values.push(review.author)
      query += "author=$" + i + " AND "
    }
    
    if(review.date != null){
      i++
      values.push(review.date)
      query += "date=$" + i + " AND "
    }
    
    if(review.restaurant != null) {
      i++
      values.push(review.restaurant)
      query += "restaurant=$" + i + " AND "
    }
    
    if(review.dish != null) {
      i++
      values.push(review.dish)
      query += "dish=$" + i + " AND "
    }
    
    if(review.rating != null) {
      i++
      values.push(review.rating)
      query += "rating=$" + i + " AND "
    }

    query = query.slice(0, -4) // remove last 'AND '
  }

  try{
    let res = await client.query(query, values)
    return res.rows
  }
  catch(err){
    console.log(err);
    return false
  }
}

async function getTeacherReview(review:TeacherReview){
  console.log('get teacher reviews')
  
  let query = "SELECT * FROM teacher_review"
  let values = []

  if(review.description != null || review.author != null || review.date != null || review.class != null || review.teacher != null ){
    query += " WHERE "
    let i = 0

    if(review.description != null) {
      i++
      values.push(review.description)
      query += "description=$" + i + " AND "
    }

    if(review.author != null){
      i++
      values.push(review.author)
      query += "author=$" + i + " AND "
    }
    
    if(review.date != null){
      i++
      values.push(review.date)
      query += "date=$" + i + " AND "
    }
    
    if(review.class != null) {
      i++
      values.push(review.class)
      query += "class=$" + i + " AND "
    }
    
    if(review.teacher != null) {
      i++
      values.push(review.teacher)
      query += "teacher=$" + i + " AND "
    }

    query = query.slice(0, -4) // remove last 'AND '
  }

  try{
    let res = await client.query(query, values)
    return res.rows
  }
  catch(err){
    console.log(err);
    return false
  }
}


export default {
    getFeedback,
    getMealReview,
    getTeacherReview,
    postMealReview,
    postTeacherReview
}