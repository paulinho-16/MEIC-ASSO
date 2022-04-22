import { Client } from 'pg'

const client = new Client({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})




async function getGroups() {

  client.connect()
  .then(() => console.log('connected'))
  .catch((err) => console.error('connection error', err.stack))


  console.log("Get groups");

  let query = "SELECT * from GroupBody";

  try {
    let res = await client.query(query)
    return res.rows
  }
  catch (err) {
    console.log(err);
    return false
  }

}


export default {
  getGroups
}
