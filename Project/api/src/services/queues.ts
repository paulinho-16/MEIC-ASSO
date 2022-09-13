import { Client } from 'pg'

import {
  Queue,
} from '@/@types/queues'

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


async function postQueue(queue:Queue){
  console.log('post queue status')
  
  let query = "SELECT * FROM queues WHERE restaurant=$1 AND author=$2" 
  let values = [queue.restaurant, queue.author]

  try{
    let res = await client.query(query, values)
    // If user has already inserted a queue status for the given restaurant, update their queue status value
    if(res.rows.length > 0){query = 'UPDATE queues SET value=$3 WHERE restaurant=$1 and author=$2'}
    // Else, create a new one
    else {query = 'INSERT INTO queues(restaurant, author, value) VALUES ($1, $2, $3)'}
    values = [queue.restaurant, queue.author, queue.value]
    res = await client.query(query, values)
    return true
  }
  catch(err){
    console.log(err);
    return false
  }
}

async function getQueue(restaurant:Number){
  console.log('get queue status')
  
  let query = "SELECT * FROM queues WHERE restaurant=$1 AND timestamp > NOW() - interval '60 minutes' ORDER BY timestamp" 
  let values = [restaurant]

  try{
    let res = await client.query(query, values)
    if (res.rows.length == 0) return -1

    let now_ts = Date.now()/1000
    let sum_entries = 0.0
    let sum_values = 0.0
    res.rows.forEach(row => {
      let row_ts = new Date(row.timestamp).getTime()/1000
      sum_values += row.value * (1/(now_ts - row_ts))
      sum_entries += 1/(now_ts - row_ts)
    });
    
    return {
      "average_value": Math.round((sum_values/sum_entries) * 100) / 100,
      "last_entry_value": res.rows[res.rows.length-1].value,
      "last_entry_timestamp": res.rows[res.rows.length-1].timestamp
    }
  }
  catch(err){
    console.log(err);
    return false
  }
}

export default {
    getQueue,
    postQueue
}