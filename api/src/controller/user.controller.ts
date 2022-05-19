import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userService from '@/services/user'
import redisClient from '@/util/connect-redis'
import { sendEmail } from '@/util/send-email'
import constants from '@/config/constants'

// ----------------------------------------------------------------------------
// Endpoints
// ----------------------------------------------------------------------------

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
    // Delete session
    await redisClient.del(JSON.stringify(req.body.id));
    // Delete cookie
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
    return res.status(500).json({ message: `Get user failed with error: ${err}` })
  }
  if (!user) return res.status(401).json({ message: 'The user does not exist' })

  // Validate password
  if (!(await bcrypt.compare(oldPassword, user.password)))
    return res.status(400).json({ message: 'Invalid current password' })

  // Check if password has errors
  const passwordErrors = userService.getPasswordErrors(newPassword);
  if (passwordErrors !== null)
    return res.status(400).json({ message: `The new password is not strong enough: ${passwordErrors}` })

  // Encrypt user new password
  const encryptedPassword = await bcrypt.hash(newPassword, 10)

  try {
    await userService.updatePassword(req.body.id, encryptedPassword)
    return res.status(200).json({ message: 'Update password with success' })
  } catch (err) {
    return res.status(500).json({ message: 'Update password failed' })
  }
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
    user = await userService.getUserByEmail(email)
  } catch (err) {
    return res.status(500).json({ message: `Get user failed with error: ${err}` })
  }
  if (!user) return res.status(401).json({ message: 'The user does not exist' })

  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_PASS_RESET_KEY, { expiresIn: constants.passResetTokenLifetime })

  const emailResult = await sendEmail(user.email, "Password reset", messageText(resetToken));

  const status = emailResult.status ? 200 : 500
  return res.status(status).json({ message: emailResult.message })
}

async function resetPassword(req: Request, res: Response){
  // Get password
  const { password } = req.body;

  if(!password) {
    return res.status(400).json({ message: 'New password is required' })
  }

  // Check if password has errors
  const passwordErrors = userService.getPasswordErrors(password);
  if (passwordErrors !== null)
    return res.status(400).json({ message: `The password is not strong enough: ${passwordErrors}` })

  // Encrypt user password
  const encryptedPassword = await bcrypt.hash(password, 10)

  // TODO: should invalidate token
  try {
    await userService.updatePassword(req.body.id, encryptedPassword)
    return res.status(200).json({'message': 'Update password with success'})
  } catch(err){
    return res.status(400).json({'message': 'Update password failed'})
  }
}

function messageText(resetToken: string){
  return `<p>To recover your password use the following token: ${resetToken}
  in the POST <a href='https://uni4all.servehttp.com/user/reset-password'>user/reset-password</a>
  endpoint</p>.
  <p>This token expires in ${constants.passResetTokenLifetime/60} minutes.
  Be sure to access your account and update it within this period.</p>`
}

export default {
  forgotPassword,
  resetPassword,
  deleteUser,
  updatePassword,
}
