import { Client } from 'pg'

import {
    MealReview,
    TeacherReview,
} from '@/@types/reviews'

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'db',
    password: 'example',
    port: 5432,
})

function getFeedback(id:number) {
    client.connect()

    /*
    client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
        console.log(err ? err.stack : res.rows[0].message) // Hello World!
        client.end()
    }) */
}

function postMealReview(/* review:MealReview */){
    
    client.connect()
    const query = {
        text: 'INSERT INTO MealReview(description, author, date, establishment, dish, rating) VALUES($1, $2, $3, $4, $5, $6)',
        values: ['tava top', 'Utilizador123', 'NOW()', 'Grill', 'Febras', '4.5'],
      }
    client.query(query, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log(res.rows[0])
        }
    })
    client.end()
}

function postTeacherReview(){
    client.connect()
    const query = {
        text: 'INSERT INTO TeacherReview(description, author, date, class, teacher) VALUES($1, $2, $3, $4, $5)',
        values: ['pessimo stor', 'Utilizador123', 'NOW()', 'SDIS', 'Souto'],
      }
    client.query(query, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log(res.rows[0])
        }
    })
    client.end()
}


export default {
    getFeedback,
    postMealReview,
    postTeacherReview
}