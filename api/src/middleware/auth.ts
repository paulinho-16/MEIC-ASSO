import { Request, Response, NextFunction } from 'express'
import constants from '@/config/constants'
import jwt from 'jsonwebtoken'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"]

  if (!token) {
    return res.status(403).json({'message': 'A token is required for authentication'})
  }
  
  const decoded = jwt.verify(token, constants.secret, (err: any, decoded: { username: any }) => {
    if(err)
      return res.status(401).json({'message': 'Invalid Token'})
      
    req.body.user_id = decoded.username
  })

  return next()
}

export default verifyToken