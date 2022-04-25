import { Client } from 'pg'

const client = new Client({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})


async function connectDatabase(){

  let connected = false;

  client.connect()
  .then(() => connected = true)
  .catch((err) => console.error('connection error', err.stack))
  
  if(connected){

    console.log("Connected")
    return true;

  }

  return false;

}

async function getGroups() {

  console.log("Get groups");

  if(!connectDatabase()){
    
    return -1;
  }

  let query = "SELECT * from groups";

  try {
    let res = await client.query(query)
    return res.rows
  }
  catch (err) {
    console.log(err);
    return false
  }

}

async function createGroup(){

    console.log("Create group");

    if(!connectDatabase()){
      return -1;
    }

    

  



}


export default {
  getGroups,
  createGroup
}
