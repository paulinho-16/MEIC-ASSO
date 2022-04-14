import { Request, Response } from 'express'

import constants from '../config/constants'

async function postAuthentication(req: Request, res: Response) {
  let formData = new FormData()
  formData.append('pv_login', req.body.username)
  formData.append('pv_password', req.body.password)
  let authRes = await fetch(constants.authUrl, {
    method: 'POST',
    body: formData,
  })

  if (authRes.status != 200) {
    return res.status(authRes.status).json({ error: 'The username or password is incorrect!' })
  }

  const [token1, token2] = authRes.headers.get('Set-Cookie').split(',')
  if (token2 == undefined) {
  }

  return res.status(200).json({})
}

export default {
  postAuthentication,
}
