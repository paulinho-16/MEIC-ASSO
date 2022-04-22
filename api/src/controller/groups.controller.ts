import { Request, Response } from 'express'


async function getGroups(req: Request, res: Response) {

    return res.status(200).send("Get from Group")

}

async function createGroup(req: Request, res: Response) {

    return res.status(200).send("Create from Group")
}

export default {
    getGroups,
    createGroup
}