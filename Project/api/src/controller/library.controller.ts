import { Request, Response } from 'express'

import libraryService from '@/services/library'

async function get(req: Request, res: Response) {
  const data = await libraryService.fetchLibraryOccupation()

  return res.status(200).json(data)
}

export default {
  get,
}
