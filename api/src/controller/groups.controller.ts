import { Request, Response } from 'express'

import groups from '@/services/groups'

import {
    Group
} from '@/@types/groups'



// Groups Endpoints.

async function getGroups(req: Request, res: Response) {
    
    const data = await groups.getGroups(req)

    if (data) {
        res.json(data)
    }
    else {
        res.status(500).send('Error')
    }

    return

}

async function getGroup(req: Request, res: Response) {

    if(!req.params.id) {
        return res.status(400).send({
            message: "No group id was specified."
        });
    }

    if(isNaN(parseInt(req.params.id.toString()))){
        res.status(400).send('id must be an integer.')
        return
    }

    const data = await groups.getGroup(parseInt(req.params.id.toString()))

    if(data){
        res.json(data)
      }
      else{
        res.status(500).send('Something went wrong. Try again!')
    }

}

async function createGroup(req: Request, res: Response) {

    // TODO: User that creates Group needs to be added as a member.

    if(!req.body) {
        return res.status(400).send({
            message: "Group content can not be empty"
        });
    }

    const query = req.body

    if(query.typename == undefined || query.title == undefined || query.description == undefined || query.mlimit == undefined || query.autoaccept == undefined) {
      res.status(400).send('This request must have \'typename\', \'title\', \'description\', \'mlimit\' and \'autoaccept\'.')
      return
    }
  
    if(query.typename == '' || query.title == '' || query.description == '') {
      res.status(400).send('\'typename\', \'title\' and \'description\' can\'t be empty strings.')
      return
    }
  
    if(isNaN(parseInt(query.mlimit.toString()))){
      res.status(400).send('mlimit must be an integer.')
      return
    }
  
    const group: Group = {
        typename: query.typename.toString(),
        title: query.title.toString(),
        description: query.description.toString(),
        mlimit: parseInt(query.mlimit.toString()),
        autoaccept: Boolean(query.autoaccept.toString())
    }

    

    const data = await groups.createGroup(group)
    
    let groupId;
    let result;
    if(data){
        groupId = data["rows"][0]["id"]
        
        result = await groups.createGroupMember(groupId,req.body.id)
        
        
    }

    
    if(result){
      res.status(201).send('Success')
    }
    else{
      res.status(500).send('Something went wrong. Try again!')
    }
}


async function deleteGroup(req: Request, res: Response) { 

    if(!req.params.groupId) {
        return res.status(400).send({
            message: "No group id was specified."
        });
    }

    if(isNaN(parseInt(req.params.groupId.toString()))){
        res.status(400).send('id must be an integer.')
        return
    }

    const data = await groups.deleteGroup(parseInt(req.params.groupId.toString()))

    if(data){
      res.status(201).send('Success')
    }
    else{
      res.status(500).send('Something went wrong. Try again!')
    }

}

async function getMyGroups(req: Request, res: Response){
    
    if(!req.params.id){
        return res.status(400).send({
            message: "No user id was specified."
        });
    }

    if(isNaN(parseInt(req.params.id.toString()))){
        res.status(400).send('User id must be an integer.')
        return
    }

    //possible check to verify if the session user matches the id of the request

    const data = await groups.getMyGroups(parseInt(req.params.id.toString()))

    if(data){
        res.json(data)
      }
      else{
        res.status(500).send('Something went wrong. Try again!')
    }

}

async function editGroup(req: Request, res: Response){

    if(!req.params.groupId) {
        return res.status(400).send({
            message: "No group id was specified."
        });
    }

    if(isNaN(parseInt(req.params.groupId.toString()))){
        res.status(400).send('id must be an integer.')
        return
    }

    //TODO: Possible admin checks

    const query = req.body

    if(query.typename == undefined || query.title == undefined || query.description == undefined || query.mlimit == undefined || query.autoaccept == undefined) {
      res.status(400).send('This request must have \'typename\', \'title\', \'description\', \'mlimit\' and \'autoaccept\'.')
      return
    }
  
    if(query.typename == '' || query.title == '' || query.description == '') {
      res.status(400).send('\'typename\', \'title\' and \'description\' can\'t be empty strings.')
      return
    }
  
    if(isNaN(parseInt(query.mlimit.toString()))){
      res.status(400).send('mlimit must be an integer.')
      return
    }
  
    const group: Group = {
        typename: query.typename.toString(),
        title: query.title.toString(),
        description: query.description.toString(),
        mlimit: parseInt(query.mlimit.toString()),
        autoaccept: Boolean(query.autoaccept.toString())
    }

    const data = await groups.editGroup(parseInt(req.params.groupId.toString()),group);

    if(data){
        res.status(200).send('The group was successfuly edited.')
      }
      else{
        res.status(500).send('Something went wrong. Try again!')
    }


}

// Group admin endpoints
async function getGroupAdmins(req: Request, res: Response) {

    if(!req.params.groupId) {
        return res.status(400).send({
            message: "No group id was specified."
        });
    }

    if(isNaN(parseInt(req.params.groupId.toString()))){
        res.status(400).send('id must be an integer.')
        return
    }

    const data = await groups.getGroupAdmins(parseInt(req.params.groupId.toString()), req)


    if(data){
        res.json(data)
      }
      else{
        res.status(500).send('Something went wrong. Try again!')
    }

}


async function addGroupAdmin(req: Request, res: Response) {
  
    if(isNaN(parseInt(req.params.groupId.toString()))){
      res.status(400).send('group id must be an integer.')
      return
    }

    if(isNaN(parseInt(req.params.userId.toString()))){
        res.status(400).send('user id must be an integer.')
        return
      }

    await groups.createGroupMember(parseInt(req.params.groupId.toString()), parseInt(req.params.userId.toString()));

    const data = await groups.addGroupAdmin(parseInt(req.params.id.toString()), parseInt(req.params.userId.toString()))

    if(data){
      res.status(201).send("User successfully added!")
    }
    else{
      res.status(500).send('Something went wrong. Try again!')
    }
}

async function deleteGroupAdmin(req: Request, res: Response) { 

    if(!req.params.groupId) {
        return res.status(400).send({
            message: "No group id was specified."
        });
    }

    if(isNaN(parseInt(req.params.groupId.toString()))){
        res.status(400).send('id must be an integer.')
        return
    }

    if(!req.params.userId) {
        return res.status(400).send({
            message: "No user id was specified."
        });
    }

    if(isNaN(parseInt(req.params.userId.toString()))){
        res.status(400).send('userId must be an integer.')
        return
    }

    const data = await groups.deleteGroupAdmin(parseInt(req.params.groupId.toString()), parseInt(req.params.userId.toString()))

    if(data){
        res.status(200).send('The group admin was successfuly removed.')
      }
      else{
        res.status(500).send('Something went wrong. Try again!')
    }

}




// Members Endpoints.


async function getGroupMembers(req: Request, res: Response) {  

    if (req.params.groupId == undefined) {
        res.status(400).send('You need to pass an group Id.')
    }

    if(isNaN(parseInt(req.params.groupId.toString()))){
        res.status(400).send('Group Id must be an integer.')
        return
    }

    const data = await groups.getGroupMembers(parseInt(req.params.groupId.toString()), req)

    if(data){
        res.json(data)
    } else {
        res.status(500).send('Something went wrong. Try again!')
    }

}

async function getGroupMember(req: Request, res: Response) {  

    if (req.params.groupId == undefined) {
        res.status(400).send('You need to pass an group Id.')
    }

    if(isNaN(parseInt(req.params.groupId.toString()))){
        res.status(400).send('Group Id must be an integer.')
        return
    }

    const data = await groups.getGroupStudentRelation(parseInt(req.params.groupId.toString()), parseInt(req.params.userId.toString()))

    if(data){
        res.json(data)
    } else {
        res.status(500).send('Something went wrong. Try again!')
    }

}



async function createGroupMember(req: Request, res: Response) {  
    
    if (req.params.groupId == undefined || req.params.userId == undefined) {
        res.status(400).send('You need to pass an group id and a user id.')
    }

    if(isNaN(parseInt(req.params.groupId.toString()))){
        res.status(400).send('Group Id must be an integer.')
        return
    }

    if(isNaN(parseInt(req.params.userId.toString()))){
        res.status(400).send('User Id must be an integer.')
        return
    }

    const data = await groups.createGroupMember(parseInt(req.params.groupId.toString()), parseInt(req.params.userId.toString()))

    // TODO: Fix Status Code for errors.

    if(data){
        res.json(data)
    } else {
        res.status(500).send('Something went wrong. Try again!')
    }

}



async function deleteGroupMember(req: Request, res: Response) {  

    if (req.params.groupId == undefined || req.params.userId == undefined) {
        res.status(400).send('You need to pass an group id and a user id.')
    }

    if(isNaN(parseInt(req.params.groupId.toString()))){
        res.status(400).send('Group Id must be an integer.')
        return
    }

    if(isNaN(parseInt(req.params.userId.toString()))){
        res.status(400).send('User Id must be an integer.')
        return
    }

    const data = await groups.deleteGroupMember(parseInt(req.params.groupId.toString()), parseInt(req.params.userId.toString()))

    // TODO: Fix Status Code for errors.

    if(data){
        res.status(204).json(data)
    } else {
        res.status(500).send('Something went wrong. Try again!')
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
    getGroupMember,
    createGroupMember,
    deleteGroupMember
}
