import { Client } from 'pg'
import { Request, Response } from 'express'


import {
  Group
} from '@/@types/groups'





// Database Setup Methods.

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







// Group Methods.


async function getGroups(req: Request) {

  console.log("Get groups");

  if(!connectDatabase()){
    return -1;
  }

  var query = "SELECT * from groups"


  // If filter by group.
  if (req.query.classId !== undefined) {

    var classId = parseInt(req.query.classId.toString())
    
    query = query + " WHERE classId = " + classId
  }


  query = query + " ORDER BY groups.id DESC"


  // In the case of pagination
  if (req.query.offset !== undefined && req.query.limit !== undefined) {

    var limitInt = parseInt(req.query.limit.toString())
    var offsetInt = parseInt(req.query.offset.toString())

    query = query + " LIMIT " + limitInt + " OFFSET " + offsetInt
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

async function getMyGroups(id: Number) {

  console.log("Get User groups");

  if(!connectDatabase()){ 
    return -1;
  }

  const query = {
    text: 'SELECT * FROM Groups, Group_Student  WHERE studentId = $1 AND Groups.id = Group_Student.groupId',
    values: [id],
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
      text: 'INSERT INTO Groups(typeName, title, "description", mlimit, autoAccept) VALUES($1, $2, $3, $4, $5) RETURNING id;',
      values: [group.typename, group.title, group.description, group.mlimit, group.autoaccept],
    }


    try{

      let result = await client.query(query)

      
    
      return result
    }
    catch(err){
      console.log(err);
      return err
    }



    
  
    
}

async function editGroup(groupId: Number, group: Group){

  console.log("Edit group");
  
  if(!connectDatabase()){
    return -1;
  }

  const query = {
    text: 'UPDATE groups SET typeName=$1, title=$2, "description"=$3,mlimit=$4,autoAccept=$5 WHERE id = $6',
    values : [group.typename, group.title, group.description, group.mlimit, group.autoaccept, groupId],
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

// Group Admin Endpoints
async function getGroupAdmins(groupId: Number, req: Request)
{
  console.log("Get group admins");

  if(!connectDatabase()){ 
    return -1;
  }

  var query = {
    text: `SELECT * 
           FROM UniUser
           INNER JOIN Group_Student
           ON Student.id = Group_Student.studentId
           AND isAdmin = true
           AND Group_Student.groupId = $1`,
    values: [groupId],
  }

  // In the case of pagination
  if (req.query.offset !== undefined && req.query.limit !== undefined) {

    var limitInt = parseInt(req.query.limit.toString())
    var offsetInt = parseInt(req.query.offset.toString())

    query = {
      text: `SELECT * 
            FROM UniUser
            INNER JOIN Group_Student
            ON Student.id = Group_Student.studentId
            AND isAdmin = true
            AND Group_Student.groupId = $1
            ORDER BY Group_Student.id DESC LIMIT $2 OFFSET $3;`,
      values: [groupId, limitInt, offsetInt],
    }

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


async function addGroupAdmin(groupId: Number, studentId: Number){

  if(!connectDatabase()){
    return -1;
  }

  const query = {
    text: `UPDATE Group_Student 
          SET isAdmin = true 
          WHERE studentId = $1 
          AND groupId = $2`,
    values: [studentId, groupId],
  }

  try{
    let res = await client.query(query)
    return res.rows
  }
  catch(err){
    console.log(err);
    return false
  }
}

async function deleteGroupAdmin(groupId: Number, studentId: Number){

  console.log("Delete group admin");

  if(!connectDatabase()){
    return -1;
  }

  const query = {
    text: `UPDATE Group_Student
           SET isAdmin = false
           WHERE studentId = $1
           AND groupId = $2`,
    values: [studentId, groupId],
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






// Member Endpoints.


async function getGroupMembers(groupId: Number, req: Request) {

  console.log("Get group members");

  if(!connectDatabase()){ 
    return -1;
  }

  var query = {
    text: 'SELECT * FROM Group_Student WHERE groupId = $1',
    values: [groupId],
  }

  // In the case of pagination
  if (req.query.offset !== undefined && req.query.limit !== undefined) {

    var limitInt = parseInt(req.query.limit.toString())
    var offsetInt = parseInt(req.query.offset.toString())

    query = {
      text: 'SELECT groupId, email,studentId, isAdmin, isAccepted FROM Group_Student, UniUser WHERE groupId = $1 AND Group_Student.studentId = UniUser.id ORDER BY Group_Student.id DESC LIMIT $2 OFFSET $3 ;',
      values: [groupId, limitInt, offsetInt],
    }

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



async function getGroupStudentRelation(groupId: Number, userId: Number) { 

  if(!connectDatabase()){ 
    return -1;
  }

  const query = {
    text: 'SELECT * FROM Group_Student WHERE groupId = $1 AND studentId = $2',
    values: [groupId, userId],
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



async function createGroupMember(groupId: Number, userId: Number) { 

  if(!connectDatabase()){ 
    return -1;
  }

  console.log("Add group member");

  // Check if student is already member.
  const isStudentAlreadyMember = await getGroupStudentRelation(groupId, userId)

  if (isStudentAlreadyMember != false) {
    return "The student is already a member of this group."
  }

  // Check if student exists. 
  const student = await getStudent(userId)

  if (student == false) {
    return "Student does not exist."
  }


  // Check if group exists.
  const group = await getGroup(groupId)

  if (group == false) {
    return "Group does not exist."
  }


  // Create group-student relation.

  const query = {
    text: 'INSERT INTO Group_Student (groupId, studentId) VALUES ($1, $2)',
    values: [groupId, userId],
  }

  try {
    let res = await client.query(query)
    return await getGroupStudentRelation(groupId, userId)
  }
  catch (err) {
    console.log(err);
    return false
  }

}




async function deleteGroupMember(groupId: Number, userId: Number) { 

  if(!connectDatabase()){ 
    return -1;
  }


  // Check if student is already member.
  const isStudentAlreadyMember = await getGroupStudentRelation(groupId, userId)

  if (isStudentAlreadyMember == false) {
    return "The student is not a member of this group."
  }

  // Check if student exists. 
  const student = await getStudent(userId)

  if (student == false) {
    return "Student does not exist."
  }


  // Check if group exists.
  const group = await getGroup(groupId)

  if (group == false) {
    return "Group does not exist."
  }


  // Delete group-student relation.

  const query = {
    text: 'DELETE FROM Group_Student WHERE groupId = $1 AND studentId = $2',
    values: [groupId, userId],
  }

  try {
    let res = await client.query(query)
    return await getGroupStudentRelation(groupId, userId)
  }
  catch (err) {
    console.log(err);
    return false
  }

}






// Student Methods

async function getStudent(userId: Number) { 

  if(!connectDatabase()){ 
    return -1;
  }

  const query = {
    text: 'SELECT * FROM UniUser WHERE id = $1',
    values: [userId],
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






export default {
  getGroups,
  getGroup,
  createGroup,
  deleteGroup,
  getMyGroups,
  editGroup,

  getGroupAdmins,
  addGroupAdmin,
  deleteGroupAdmin,

  getGroupMembers,
  getGroupStudentRelation,
  createGroupMember,
  deleteGroupMember
}
