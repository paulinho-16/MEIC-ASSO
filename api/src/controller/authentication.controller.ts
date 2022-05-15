import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userService from '@/services/user'
import constants from '@/config/constants'

async function testAuth(req: Request, res: Response) {
  return res.status(200).json({ message: req.body.id })
}

async function login(req: Request, res: Response) {
  // Get user credentials
  const { email, password } = req.body

  // Check if all inputs were filled
  if (!(email && password))
    return res.status(400).json({ message: 'Email and password are required' })

  // Validate if user exists
  let user
  try {
    user = await userService.getUserByEmail(email)
  } catch (err) {
    return res.status(400).json({ message: `Get user failed with error: ${err}` })
  }

  // Verify existence of user
  if (!user) return res.status(400).json({ message: 'The user does not exist' })

  // Validate password
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: 'Invalid credentials' })

  // Create token
  const id = user.id
  const token = jwt.sign({ id }, process.env.JWT_GENERATOR_KEY, { expiresIn: constants.tokenLifetime })
  res.cookie('jwt', token, { httpOnly: true, maxAge: constants.tokenLifetime * 1000 })
  return res.status(200).json({ message: 'Login with success', id: id })
}

function logout(req: Request, res: Response) {
  // Delete cookie
  res.cookie('jwt', '', { maxAge: 0 })

  return res.status(200).json({ message: 'Logout with success' })
}

export default {
  login,
  logout,
  testAuth,
}
