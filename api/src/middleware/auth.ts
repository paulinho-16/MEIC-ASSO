import { Request, Response, NextFunction } from 'express'
import constants from '@/config/constants'
import jwt from 'jsonwebtoken'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({'message': 'A token is required for authentication'});
  }
  try {
    const decoded = jwt.verify(token, constants.secret,);
    console.log(decoded)
  } catch (err) {
    return res.status(401).json({'message': 'Invalid Token'});
  }
  return next()
}

export default verifyToken