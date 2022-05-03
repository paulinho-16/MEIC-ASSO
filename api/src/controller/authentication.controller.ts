import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import authService from '@/services/authentication'
import constants from '@/config/constants'
import { User } from '@/@types/user'
import { sendEmail } from '@/util/sendEmail'

async function testAuth(req: Request, res: Response) {
  return res.status(200).json({ message: req.body.id })
}

async function register(req: Request, res: Response) {
  // Get user credentials
  const { email, password } = req.body

  // Check if all inputs were filled
  if (!(email && password))
    return res.status(400).json({ message: 'Email and password are required' })

  // Check if email is valid
  const regexp = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
  if (!regexp.test(email))
    return res.status(400).json({ message: `The email '${email}' is not valid` })

  // Check if user already exists
  try {
    const oldUser = await authService.getUserByEmail(email)
    if (oldUser) return res.status(409).json({ message: 'This user already exists. Please Login' })
  } catch (err) {
    return res.status(400).json({ message: `Get user failed with error: ${err}` })
  }

  // Encrypt user password
  const encryptedPassword = await bcrypt.hash(password, 10)

  const user: User = {
    email,
    password: encryptedPassword,
  }

  // Insert user
  let id = -1
  try {
    id = await authService.insertUser(user)
    if (id == -1) return res.status(400).json({ message: `Insert user failed` })
  } catch (err) {
    return res.status(400).json({ message: `Insert user failed with error: ${err}` })
  }

  return res.status(201).json({ message: 'Registered with success' })
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
    user = await authService.getUserByEmail(email)
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
  const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: constants.tokenLifetime })
  res.cookie('jwt', token, { httpOnly: true, maxAge: constants.tokenLifetime * 1000 })
  return res.status(200).json({ message: 'Login with success', token: token })
}

async function logout(req: Request, res: Response) {
  // Delete cookie
  res.cookie('jwt', '', { maxAge: 0 })

  return res.status(200).json({ message: 'Logout with success' })
}

async function forgotPassword(req: Request, res: Response){
  // Get user email
  const { email } = req.body

  // Check if email was filled
  if (!email)
    return res.status(400).json({ message: 'Email is required' })

  // Validate if user exists
  let user
  try {
    user = await authService.getUserByEmail(email)
  } catch (err) {
    return res.status(400).json({ message: `Get user failed with error: ${err}` })
  }
  if (!user) return res.status(400).json({ message: 'The user does not exist' })
  
  const token = jwt.sign({ id: user.id }, process.env.PASS_RESET_KEY, { expiresIn: constants.passResetTokenLifetime })
  const link = `${process.env.SERVER_URL}/authentication/resetPassword/${token}`;
  
  try {
    const result = await sendEmail(user.email, "Password reset", link);
    return res.status(200).json({'message': result })
  } catch(err){
    return res.status(400).json({'message': err})
  }
  
}

async function resetPassword(req: Request, res: Response){
  // Get token and password
  const { password } = req.body;

  // Encrypt user password
  const encryptedPassword = await bcrypt.hash(password, 10)

  try {
    await authService.updatePassword(req.body.id, encryptedPassword)
    return res.status(200).json({'message': 'Update password with success'})
  } catch(err){
    return res.status(400).json({'message': 'Update password failed'})
  }
}

export default {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  testAuth,
}
