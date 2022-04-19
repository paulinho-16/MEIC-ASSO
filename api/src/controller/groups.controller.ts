import { Request, Response } from 'express'

import groupsService from '../services/associations'

async function getGroups(req: Request, res: Response) {
  return res.status(200)
}

export default {
    getGroups,
}