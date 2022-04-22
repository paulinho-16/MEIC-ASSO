import { Request, Response } from 'express'

import groups from '@/services/groups'




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

    return res.status(200).send("Create from Group")
}

export default {
    getGroups,
    createGroup
}