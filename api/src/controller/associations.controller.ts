import { Request, Response } from 'express'

import associationsService from '../services/associations'

async function getAssociations(req: Request, res: Response) {
    const associations = await associationsService.scrap()
    return res.status(200).json(associations)
}

export default {
  getAssociations,
}
