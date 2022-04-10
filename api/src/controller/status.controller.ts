import { Request, Response } from 'express'
import { format } from '@/util/time'

async function get(req: Request, res: Response) {
  const uptime = format(Number(process.uptime()))
  return res.status(200).json({ message: "I've been up for: " + uptime })
}

export default {
  get,
}
