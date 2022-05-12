import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import authService from '@/services/authentication'

function verifySessionToken(req: Request, res: Response, next: NextFunction){
  const token = req.cookies.jwt

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' })
  }

  jwt.verify(token, process.env.JWT_GENERATOR_KEY, async (err: Error | null, decoded: { id: number }) => {
    if (err) return res.status(401).json({ message: 'Invalid Token' })

    req.body.id = decoded.id

    // Verify if user exists
    let user
    try {
      user = await authService.getUserById(req.body.id)
    } catch (err) {
      return res.status(400).json({ message: `Get user failed with error: ${err}` })
    }

    // Verify existence of user
    if (!user) return res.status(400).json({ message: 'The user does not exist' })

    next()
  })
}

function verifyPasswordResetToken(req: Request, res: Response, next: NextFunction){
  const token = req.params.token

  if (!token) {
    return res.status(403).json({ message: 'A token is required for authentication' })
  }

  jwt.verify(token, process.env.JWT_PASS_RESET_KEY, async (err: Error | null, decoded: { id: number }) => {
    if (err) return res.status(401).json({ message: 'Invalid Token' })

    req.body.id = decoded.id

    // Verify if user exists
    let user
    try {
      user = await authService.getUserById(req.body.id)
    } catch (err) {
      return res.status(400).json({ message: `Get user failed with error: ${err}` })
    }

    // Verify existence of user
    if (!user) return res.status(400).json({ message: 'The user does not exist' })

    next()
  })
}

export default {
  verifySessionToken,
  verifyPasswordResetToken
}
