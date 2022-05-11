import { Request, Response } from 'express'

async function get(req: Request, res: Response) {
  return res.status(200).json({ url: "http://uni4all.servehttp.com:8082/"})
}

export default {
  get,
}
