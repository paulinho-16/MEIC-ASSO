import { Client } from 'pg'

import {
    MealReview,
    TeacherReview,
} from '@/@types/reviews'

const client = new Client({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'example',
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

function postMealReview(review:MealReview){
    console.log('post meal review')
    
    const query = {
      text: 'INSERT INTO MealReview(description, author, date, establishment, dish, rating) VALUES($1, $2, $3, $4, $5, $6)',
      values: [review.description, review.author, review.date, review.establishment, review.dish, review.rating],
    }

    client.query(query)
      .then((res) => console.log(res.rows[0]))
      .catch((err) => console.log(err.stack))
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

function getMealReview(){
  console.log('get meal reviews')
    
  client.connect()
    .then(() => console.log('connected'))
    .catch((err) => console.error('connection error', err.stack))

  client.query('SELECT * FROM MealReview')
    .then((res) => console.log(res.rows[0]))
    .catch((err) => console.log(err.stack))
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