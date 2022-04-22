import { Request, Response } from 'express'

import getGroupsService from '@/services/groups'


async function getGroups(req: Request, res: Response) {
    let result = getGroupsService();
    return res.status(200).send(result)

}

async function createGroup(req: Request, res: Response) {

    return res.status(200).send("Create from Group")
}

export default {
    getGroups,
    createGroup
}