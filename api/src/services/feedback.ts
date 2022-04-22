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
    text: 'INSERT INTO MealReview(description, author, date, restaurant, dish, rating) VALUES($1, $2, $3, $4, $5, $6)',
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

function postTeacherReview(){
    // client.connect()
    // const query = {
    //     text: 'INSERT INTO TeacherReview(description, author, date, class, teacher) VALUES($1, $2, $3, $4, $5)',
    //     values: ['pessimo stor', 'Utilizador123', 'NOW()', 'SDIS', 'Souto'],
    //   }
    // client.query(query, (err, res) => {
    //     if (err) {
    //       console.log(err.stack)
    //     } else {
    //       console.log(res.rows[0])
    //     }
    // })
}

async function getMealReview(review:MealReview){
  console.log('get meal reviews')
  
  let query = "SELECT * FROM MealReview"
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

    query = query.slice(0, -4)
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

function getTeacherReview(){
  console.log('get teacher reviews')
      
  client.connect()
    .then(() => console.log('connected'))
    .catch((err) => console.error('connection error', err.stack))

  client.query('SELECT * FROM TeacherReview')
    .then((res) => {
      console.log(res.rows[0])

    })
    .catch((err) => {
      console.log(err.stack)
    })
}

export default {
    getFeedback,
    getMealReview,
    getTeacherReview,
    postMealReview,
    postTeacherReview
}