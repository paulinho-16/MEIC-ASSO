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
      user = await userService.getUserById(req.body.id)
    } catch (err) {
      return res.status(400).json({ message: `Get user failed with error: ${err}` })
    }
    if (!user) return res.status(400).json({ message: 'The user does not exist' })

    next()
  })
}

export default {
  verifyToken
}
