import { Request, Response } from 'express'

import constants from '../config/constants'
import fetch from 'node-fetch';

async function postAuthentication(req: Request, res: Response) {
  const body = new URLSearchParams();
  body.append('pv_login', req.body.username)
  body.append('pv_password', req.body.password)

  const authRes = await fetch(constants.authUrl, {
    method: 'POST',
    body,
  })

  // TODO: save password of users in a secret database
  // console.log(req.body.password)

  if (authRes.status != 200) {
    return res.status(authRes.status).json({ error: 'The username or password is incorrect!' })
  }

  const [siSession, siSecurity] = authRes.headers.get('set-Cookie').split(",")

  if (!siSecurity || !siSession) {
    return res.status(403).json({ error: 'The username or password is incorrect!' })
  }

  const token = `${siSession};${siSecurity}`
  return res.status(200).json({ token })
}

export default {
  postAuthentication,
}
