import { Client } from 'pg'

import {
  Group
} from '@/@types/groups'

const client = new Client({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

let connected = false;


async function connectDatabase(){

  if(connected){
    return true
  }

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


async function getGroup(groupId: Number) {

  console.log("Get group");

  if(!connectDatabase()){ 
    return -1;
  }

  const query = {
    text: 'SELECT * FROM groups WHERE id = $1',
    values: [groupId],
  }

  try {
    let res = await client.query(query)
    return res.rows
  }
  catch (err) {
    console.log(err);
    return false
  }

}



async function createGroup(group: Group){

    console.log("Create group");

    if(!connectDatabase()){
      return -1;
    }
  
    const query = {
      text: 'INSERT INTO Groups(typeName, title, "description", mlimit, autoAccept) VALUES($1, $2, $3, $4, $5)',
      values: [group.typeName, group.title, group.description, group.mLimit, group.autoAccept],
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


async function deleteGroup(groupId: Number){

  console.log("Delete group");

  if(!connectDatabase()){
    return -1;
  }

  const query = {
    text: 'DELETE FROM groups WHERE id = $1',
    values: [groupId],
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


export default {
  getGroups,
  getGroup,
  createGroup,
  deleteGroup
}
