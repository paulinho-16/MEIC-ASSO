import { Client } from 'pg'

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


function getGroupsService(){

let query = "SELECT * FROM Groups"

client.query(query)
    .then((res) => console.log(res.rows[0]))
    .catch((err) => console.log(err.stack))
}

export default {
    getGroupsService
}