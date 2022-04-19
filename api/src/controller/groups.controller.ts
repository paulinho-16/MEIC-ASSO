import { Request, Response } from 'express'

import groupsService from '../services/groups'

async function getGroups(req: Request, res: Response) {

    const data = await groupsService.getGroups

    return res.status(200)
}

export default {
    getGroups,
}