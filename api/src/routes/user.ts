import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/user.controller'

const router = express.Router()

/**
 * @swagger
 *   /user/{id}:
 *     delete:
 *       security:
 *         - jwt: []
 *       summary: Deletes an User
 *       tags:
 *         - User
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         description: Password Confirmation
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password:
 *                   type: string
 *             example:
 *               password: Password123
 *       responses:
 *         204:
 *           description: Successful deletion
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                     message: Account Deleted with success
 *         400:
 *           description: Invalid Parameters
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 password_required:
 *                   value:
 *                     message: Password is required
 *                 invalid_password:
 *                   value:
 *                     message: Invalid Password
 *                 user_not_exist:
 *                   value:
 *                     message: The user does not exist
 *         401:
 *           description: Unauthorized Action
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 unauthorized_action:
 *                   value:
 *                     message: Unauthorized action
 *                 invalid_token:
 *                   value:
 *                     message: Invalid token
 *                 invalid_session:
 *                   value:
 *                     message: Invalid session
 *                 user_not_exist:
 *                   value:
 *                     message: The user does not exist
 *         403:
 *           description: No token was provided
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                 message: Access token is required for authentication
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 account_deletion_failed:
 *                   value:
 *                     message: Account Deletion Failed
 *                 get_user:
 *                   value:
 *                     message: Get User Failed
 *                 invalid_session:
 *                   value:
 *                     message: Could not process session
 */
router.delete('/:id', auth.verifyAuthorization, controller.deleteUser)

/**
 * @swagger
 *   /user/update-password/{id}:
 *     put:
 *       security:
 *         - jwt: []
 *       summary: Update password of a user
 *       tags:
 *         - User
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         description: New and old password
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 oldPassword:
 *                   type: string
 *                 newPassword:
 *                   type: string
 *             example:
 *               oldPassword: Password123
 *               newPassword: newPassword123
 *       responses:
 *         200:
 *           description: Successful Update
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                     message: Update passsword with success
 *         400:
 *           description: Invalid Parameters
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 passwords_required:
 *                   value:
 *                     message: New and old passwords are required
 *                 invalid_password:
 *                   value:
 *                     message: Invalid current password
 *                 passord_not_strong_enough:
 *                   value:
 *                     message: The new password is not strong enough
 *         401:
 *           description: Unauthorized Action
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 invalid_user:
 *                   value:
 *                     message: The user does not exist
 *                 unauthorized_action:
 *                   value:
 *                     message: Unauthorized action
 *                 invalid_token:
 *                   value:
 *                     message: Invalid token
 *                 invalid_session:
 *                   value:
 *                     message: Invalid session
 *                 user_token:
 *                   value:
 *                     message: The user does not exist
 *         500:
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 get_user:
 *                   value:
 *                     message: Get user failed
 *                 update_password_failed:
 *                   value:
 *                     message: Update password failed
 *                 session_error:
 *                   value:
 *                     message: Could not process session
 */
 router.put('/update-password/:id', auth.verifyAuthorization, controller.updatePassword)

/**
 * @swagger
 *   /user/forgot-password:
 *     post:
 *       summary: Send a token via email that can be used to change the password when a user forgets it
 *       tags:
 *         - User
 *       requestBody:
 *         description: Account Email
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *             example:
 *               email: example@email.com
 *       responses:
 *         200:
 *           description: Email sent with success
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                     message: Email sent with success
 *         400:
 *           description: Invalid Parameters
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                     message: Email is required
 *         401:
 *           description: Invalid User
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                     message: The user does not exist
 *         500:
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 get_user:
 *                   value:
 *                     message: Get user failed
 *                 server_error:
 *                   value:
 *                     message: Failed to send email
 */
router.post('/forgot-password', controller.forgotPassword)

/**
 * @swagger
 *   /user/reset-password:
 *     post:
 *       summary: Update an user's password without knowing the previous password using a token
 *       tags:
 *         - User
 *       requestBody:
 *         description: Token and New Password
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 password:
 *                   type: string
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIbInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY1NTQ2NDMwOCwiZXhwIjoxNjU1NzIzNTA4fQ.Is_sAEggVqkcox_XTZAKia9fsOe_AhSaC655ikEES3E
 *               password: newPassword123
 *       responses:
 *         200:
 *           description: Successful Update
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                     message: Update password with success
 *         400:
 *           description: Invalid Parameters
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 password_required:
 *                   value:
 *                     message: New password is required
 *                 invalid_password:
 *                   value:
 *                     message: The password is not strong enough
 *         401:
 *           description: Unauthorized Action
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 invalid_token:
 *                   value:
 *                     message: Invalid Token
 *                 user_not_exist:
 *                   value:
 *                     message: The user does not exist
 *         403:
 *           description: Missing Token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                     message: A token is required to reset your password
 *         500:
 *           description: Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 get_user:
 *                   value:
 *                     message: Get user failed
 *                 update_password_failed:
 *                   value:
 *                     message: Update password failed
 */
router.post('/reset-password', auth.verifyPasswordResetToken, controller.resetPassword)

export default router
