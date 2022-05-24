import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import userService from '@/services/user'
import redisClient from '@/util/connect-redis';

async function verifySessionToken(req: Request, res: Response, next: NextFunction) {
  // Get access token
  const { error, token } = getAccessToken(req)
  if (error){
    return res.status(403).json({ message: 'Access token is required for authentication' })
  }

  // Verify access token
  jwt.verify(token, process.env.JWT_GENERATOR_KEY, async (err: Error | null, decoded: { id: number }) => {
    if (err){
      return res.status(401).json({ message: 'Invalid Token' })
    }
    req.body.id = decoded.id

    // Check if user has a valid session
    let session = null
    try {
      session = await redisClient.get(JSON.stringify(req.body.id))
      if (!session){
        return res.status(401).json({ message: 'Invalid session' })
      }
    } catch(err) {
      return res.status(401).json({ message: 'Could not process session' })
    }

    // Verify if user exists
    let user = null
    try {
      user = await userService.existsUserById(req.body.id)
    } catch (err) {
      return res.status(500).json({ message: `Get user failed with error: ${err}` })
    }
    if (!user) return res.status(401).json({ message: 'The user does not exist' })

    next()
  })
}

async function verifyAuthorization(req: Request, res: Response, next: NextFunction) {
  // Get access token and user id
  const { error, token } = getAccessToken(req)
  const userId = req.params.id
  if (error || !userId)
    return res.status(403).json({ message: 'Access token and user id are required' })

  // Verify access token
  jwt.verify(token, process.env.JWT_GENERATOR_KEY, async (err: Error | null, decoded: { id: number }) => {
    if (err) return res.status(401).json({ message: 'Invalid Token' })
    req.body.id = decoded.id

    // Verify if user is authorized
    if(req.body.id.toString() !== userId)
    return res.status(401).json({ message: 'Unauthorized action'})

    // Check if user has a valid session
    let session = null
    try {
      session = await redisClient.get(JSON.stringify(req.body.id));
      if (!session)
        return res.status(401).json({ message: 'Invalid session' })
    } catch(err){
      return res.status(401).json({ message: 'Couldn not process session' })
    }

    // Verify if user exists
    let user = null
    try {
      user = await userService.existsUserById(req.body.id)
    } catch (err) {
      return res.status(500).json({ message: `Get user failed with error: ${err}` })
    }
    if (!user) return res.status(401).json({ message: 'The user does not exist' })

    next()
  })
}

async function verifyPasswordResetToken(req: Request, res: Response, next: NextFunction){
  const token = req.body.token

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' })
  }

  jwt.verify(token, process.env.JWT_PASS_RESET_KEY, async (err: Error | null, decoded: { id: number }) => {
    if (err) return res.status(401).json({ message: 'Invalid Token' })
    req.body.id = decoded.id

    // Verify if user exists
    let user = null
    try {
      user = await userService.getUserById(req.body.id)
    } catch (err) {
      return res.status(500).json({ message: `Get user failed with error: ${err}` })
    }

    // Verify existence of user
    if (!user) return res.status(401).json({ message: 'The user does not exist' })

    next()
  })

}

function getAccessToken(req: Request){
  let access_token = null
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    access_token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt)
    access_token = req.cookies.jwt

  if (!access_token)
    return { error: true, token: null }

  return { error: false, token: access_token }
}

export default {
  verifySessionToken,
  verifyPasswordResetToken,
  verifyAuthorization,
}
