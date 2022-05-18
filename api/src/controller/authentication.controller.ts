import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '@/@types/user'
import userService from '@/services/user'
import redisClient from '@/util/connect-redis'
import bcrypt from 'bcrypt'
import constants from '@/config/constants'

// ----------------------------------------------------------------------------
// Auxiliary functions
// ----------------------------------------------------------------------------

function checkEmail(email: string): string | null {
  const regexp = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
  if (!regexp.test(email)) return `The email '${email}' is not valid`
  return null
}

// ----------------------------------------------------------------------------
// Endpoints
// ----------------------------------------------------------------------------

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
  const message = checkEmail(email)
  if (message) return res.status(400).json(message)

  // Check if user already exists
  try {
    const oldUser = await userService.existsUserByEmail(email)
    if (oldUser) return res.status(409).json({ message: 'This user already exists. Please Login' })
  } catch (err) {
    return res.status(400).json({ message: `Get user failed with error: ${err}` })
  }

  // Check if password has errors
  const passwordErrors = userService.getPasswordErrors(password)
  if (passwordErrors !== null)
    return res.status(400).json({ message: `The password is not strong enough: ${passwordErrors}` })

  // Encrypt user password
  const encryptedPassword = await bcrypt.hash(password, 10)

  const user: User = {
    email,
    password: encryptedPassword,
  }

  // Insert user
  let id = -1
  try {
    id = await userService.insertUser(user)
    if (id == -1) return res.status(500).json({ message: `Insert user failed` })
  } catch (err) {
    return res.status(500).json({ message: `Insert user failed with error: ${err}` })
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
    user = await userService.getUserByEmail(email)
  } catch (err) {
    return res.status(500).json({ message: `Get user failed with error: ${err}` })
  }

  // Verify existence of user
  if (!user) return res.status(406).json({ message: 'The user does not exist' })

  // Validate password
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: 'Invalid credentials' })

  // Create token
  const id = user.id
  const token = jwt.sign({ id }, process.env.JWT_GENERATOR_KEY, {
    expiresIn: constants.tokenLifetime,
  })

  // Set session
  try {
    await redisClient.set(JSON.stringify(id), JSON.stringify(user), { EX: constants.tokenLifetime })
  } catch (err) {
    return res.status(400).json({ message: 'Error creating session' })
  }

  // Set cookie
  res.cookie('jwt', token, { httpOnly: true, maxAge: constants.tokenLifetime * 1000 })

  return res.status(200).json({ message: 'Login with success', id: id, token: token })
}

async function logout(req: Request, res: Response) {
  // Delete session
  await redisClient.del(JSON.stringify(req.body.id))
  // Delete cookie
  res.cookie('jwt', '', { maxAge: 0 })
  return res.status(200).json({ message: 'Logout with success' })
}

export default {
  register,
  login,
  logout,
  testAuth,
}
