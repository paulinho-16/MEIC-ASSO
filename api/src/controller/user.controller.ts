import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import userService from '@/services/user'

async function deleteUser(req: Request, res: Response) {
  res.cookie('jwt', '', { maxAge: 0 })

  // Delete User
  try {
    await userService.deleteUserById(req.body.id)
    return res.status(201).json({ message: 'Account deleted with success' })
  } catch (err) {
    return res.status(400).json({ message: 'Account deletion failed' })
  }
}

async function updatePassword(req: Request, res: Response) {
  // Get password
  const { password } = req.body

  // Encrypt user password
  const encryptedPassword = await bcrypt.hash(password, 10)

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
