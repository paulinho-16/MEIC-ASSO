import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import userService from '@/services/user'

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' })
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err: Error | null, decoded: { id: number }) => {
    if (err) return res.status(401).json({ message: 'Invalid Token' })

    req.body.id = decoded.id

    // Verify if user exists
    let user
    try {
      user = await userService.existsUserById(req.body.id)
    } catch (err) {
      return res.status(400).json({ message: `Get user failed with error: ${err}` })
    }
    if (!user) return res.status(400).json({ message: 'The user does not exist' })

    next()
  })
}

async function verifyAuthorization(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt
  const userId = req.params.id

  if (!token || !userId) {
    return res.status(403).json({ message: 'A token is required' })
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err: Error | null, decoded: { id: number }) => {
    if (err) return res.status(401).json({ message: 'Invalid Token' })

    // Verify if user is authorized
    if(decoded.id.toString() !== userId)
      return res.status(401).json({ message: 'Unauthorized action'})
    req.body.id = decoded.id

    // Verify if user exists
    let user
    try {
      user = await userService.existsUserById(req.body.id)
    } catch (err) {
      return res.status(400).json({ message: `Get user failed with error: ${err}` })
    }
    if (!user) return res.status(400).json({ message: 'The user does not exist' })

    next()
  })
}

export default {
  verifyToken,
  verifyAuthorization
}
