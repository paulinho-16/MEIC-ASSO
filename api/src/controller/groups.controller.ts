import { Request, Response } from 'express'

import groups from '@/services/groups'

import {
    Group
} from '@/@types/groups'



// Groups Endpoints.

async function getGroups(req: Request, res: Response) {

    const data = await groups.getGroups()

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

    if(query.typeName == undefined || query.title == undefined || query.description == undefined || query.mLimit == undefined || query.autoAccept == undefined) {
      res.status(400).send('This request must have \'typeName\', \'title\', \'description\', \'mLimit\' and \'autoAccept\'.')
      return
    }
  
    if(query.typeName == '' || query.title == '' || query.description == '') {
      res.status(400).send('\'typeName\', \'title\' and \'description\' can\'t be empty strings.')
      return
    }
  
    if(isNaN(parseInt(query.mLimit.toString()))){
      res.status(400).send('mLimit must be an integer.')
      return
    }
  
    const group: Group = {
        typeName: query.typeName.toString(),
        title: query.title.toString(),
        description: query.description.toString(),
        mLimit: parseInt(query.mLimit.toString()),
        autoAccept: Boolean(query.autoAccept.toString())
    }

    const data = await groups.createGroup(group)

    if(data){
      res.status(201).send('Success')
    }
    else{
      res.status(500).send('Something went wrong. Try again!')
    }
}


async function deleteGroup(req: Request, res: Response) { 

    if(!req.params.id) {
        return res.status(400).send({
            message: "No group id was specified."
        });
    }

    if(isNaN(parseInt(req.params.id.toString()))){
        res.status(400).send('id must be an integer.')
        return
    }

    const data = await groups.deleteGroup(parseInt(req.params.id.toString()))

    if(data){
        res.status(200).send('The group was successfuly deleted.')
      }
      else{
        res.status(500).send('Something went wrong. Try again!')
    }

}





// Members Endpoints.


async function getGroupMembers(req: Request, res: Response) {  

    if (req.params.id == undefined) {
        res.status(400).send('You need to pass an group Id.')
    }

    if(isNaN(parseInt(req.params.id.toString()))){
        res.status(400).send('Group Id must be an integer.')
        return
    }

    const data = await groups.getGroupMembers(parseInt(req.params.id.toString()))

    if(data){
        res.json(data)
      }
      else{
        res.status(500).send('Something went wrong. Try again!')
    }

}



async function createGroupMember(req: Request, res: Response) {  

}



async function deleteGroupMember(req: Request, res: Response) {  

}



export default {
    getGroups,
    getGroup,
    createGroup,
    deleteGroup,
    getGroupMembers,
    createGroupMember,
    deleteGroupMember
}