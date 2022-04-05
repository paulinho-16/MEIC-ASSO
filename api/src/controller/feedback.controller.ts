import { Request, Response } from 'express'

import function from '@/servives/feddback'

async function get(req: Request, res: Response) {
  res.send('Feedback route')
}

export default {
  get,
}
