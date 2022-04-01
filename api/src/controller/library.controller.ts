import { Request, Response } from 'express'

import libraryService from '../services/library'

async function get(req: Request, res: Response) {
    const data = await libraryService.fetchLibraryOcupation()

    return res.status(200).send(data)
}

export default {
  get,
}
