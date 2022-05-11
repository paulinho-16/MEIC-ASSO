import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import userService from '@/services/user'

import { User } from '@/@types/user'

function getPasswordErrors(password: string): string | null {
  const errors = []

  // At least 6 characters
  const characters = password.length
  if (characters === 0)
    errors.push("no characters")
  else if (characters < 6)
    errors.push(`only ${password.length} character${characters == 1 ? "" : "s"}`)

  // One numeric digit
  if (!password.match(/^.*\d.*$/))
    errors.push("no digits")

  // One uppercase character
  if (!password.match(/^.*(?=.*[A-Z]).*$/))
    errors.push("no uppercase letters")

  // One lowercase character
  if (!password.match(/^.*(?=.*[a-z]).*$/))
    errors.push("no lowercase letters")

  // No errors
  if (errors.length === 0)
    return null

  // Build a message with all the errors of the password
  let errorMessage = errors.pop()
  if (errors.length !== 0)
    errorMessage = errors.join(", ") + " and " + errorMessage

  return `it needs at least 6 characters, one numeric digit, one uppercase and one lowercase letter, but it has ${errorMessage}`
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
    const oldUser = await userService.existsUserByEmail(email)
    if (oldUser) return res.status(409).json({ message: 'This user already exists. Please Login' })
  } catch (err) {
    return res.status(400).json({ message: `Get user failed with error: ${err}` })
  }

  // Check if password has errors
  const passwordErrors = getPasswordErrors(password);
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
    if (id == -1) return res.status(400).json({ message: `Insert user failed` })
  } catch (err) {
    return res.status(400).json({ message: `Insert user failed with error: ${err}` })
  }

  return res.status(201).json({ message: 'Registered with success' })
}

async function deleteUser(req: Request, res: Response) {
  // Get password
  const { password } = req.body

  // Check if password was provided
  if (!password)
    return res.status(400).json({ message: 'Password is required' })

  // Get user
  let user
  try {
    user = await userService.getUserById(req.body.id)
  } catch (err) {
    return res.status(400).json({ message: `Get user failed with error: ${err}` })
  }
  if (!user) return res.status(400).json({ message: 'The user does not exist' })

  // Validate password
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: 'Invalid password' })

  // Delete User
  try {
    await userService.deleteUserById(req.body.id)
    res.cookie('jwt', '', { maxAge: 0 })
    return res.status(201).json({ message: 'Account deleted with success' })
  } catch (err) {
    return res.status(400).json({ message: 'Account deletion failed' })
  }
}

async function updatePassword(req: Request, res: Response) {
  // Get old and new password
  const { oldPassword, newPassword } = req.body

  // Check if all inputs were filled
  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: 'New and old passwords are required' })

  // Get user
  let user
  try {
    user = await userService.getUserById(req.body.id)
  } catch (err) {
    return res.status(400).json({ message: `Get user failed with error: ${err}` })
  }
  if (!user) return res.status(400).json({ message: 'The user does not exist' })

  // Validate password
  if (!(await bcrypt.compare(oldPassword, user.password)))
    return res.status(400).json({ message: 'Invalid current password' })

  // Check if password has errors
  const passwordErrors = getPasswordErrors(newPassword);
  if (passwordErrors !== null)
    return res.status(400).json({ message: `The new password is not strong enough: ${passwordErrors}` })

  // Encrypt user new password
  const encryptedPassword = await bcrypt.hash(newPassword, 10)

  try {
    await userService.updatePassword(req.body.id, encryptedPassword)
    return res.status(200).json({ message: 'Update password with success' })
  } catch (err) {
    return res.status(400).json({ message: 'Update password failed' })
  }
}

export default {
  register,
  deleteUser,
  updatePassword,
}
