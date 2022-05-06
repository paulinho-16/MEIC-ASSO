import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import userService from '@/services/user'

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
  deleteUser,
  updatePassword,
}
