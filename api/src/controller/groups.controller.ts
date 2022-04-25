import { Request, Response } from 'express'

import groups from '@/services/groups'

import {
    Group
} from '@/@types/groups'

async function getGroups(req: Request, res: Response){

    const data = await groups.getGroups()
    if (data) {
        res.json(data)
    }
    else {
        res.status(500).send('Error')
    }

    return

}

async function createGroup(req: Request, res: Response) {

    if(!req.body) {
        return res.status(400).send({
            message: "Group content can not be empty"
        });
    }

    const query = req.body

    console.log(query)

    if(req.body.typeName == undefined) {
        res.status(400).send('typeName')
        return
    }

    if(req.body.title == undefined) {
        res.status(400).send('title')
        return
    }

    if(req.body.description == undefined) {
        res.status(400).send('description')
        return
    }

    if(req.body.mLimit == undefined) {
        res.status(400).send('mLimit')
        return
    }

    if(query.typeName == undefined || query.title == undefined || query.description == undefined || query.mLimit == undefined || query.autoAccept == undefined) {
      res.status(400).send('This request must have \'typeName\', \'title\', \'description\', \'mLimit\' and \'autoAccept\'.')
      return
    }
  
    if(query.typeName == '' || query.title == '' || query.description == '') {
      res.status(400).send('\'typeName\', \'title\' and \'description\' can\'t be empty strings.')
      return
    }
  
    if(isNaN(parseInt(query.mLimit.toString()))){
      res.status(400).send('mLimit must be a integer.')
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

export default {
    getGroups,
    createGroup
}