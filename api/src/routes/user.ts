import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/user.controller'

const router = express.Router()

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     description: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *       - in: header
 *         name: jwt
 *         required: true
 *         description: The JWT token
 *     responseBody:
 *       description: Password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "password"
 *     responses:
 *       201:
 *         description: Account was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deleted with success"
 *       400:
 *         description: Deletion failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account deletion failed"
 *       401:
 *         description: The provided token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Token"
 *       403:
 *         description: Token was not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A token is required for authentication"
 *       500:
 *         description: Unexpected error
 */
router.delete('/:id', auth.verifyAuthorization, controller.deleteUser)

/**
 * @swagger
 * /user/update-password/{id}:
 *   put:
 *     description: Change Password
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *       - in: header
 *         name: jwt
 *         required: true
 *         description: The JWT token
 *     responseBody:
 *       description: Password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldPassword"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword"
 *     responses:
 *       200:
 *         description: The password was changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Updated password successfully"
 *       400:
 *         description: Some input is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid current password"
 *       401:
 *         description: The provided token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Token"
 *       403:
 *         description: Token was not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A token is required for authentication"
 *       500:
 *         description: Unexpected error
 */
 router.put('/update-password/:id', auth.verifyAuthorization, controller.updatePassword)

/**
 * @swagger
 * /user/forgot-password:
 *   put:
 *     description: Send email to the user for password change
 *     parameters:
 *       - in: header
 *         name: jwt
 *         required: true
 *         description: The JWT token
 *     responseBody:
 *       description: Password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "example@email.com"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ""
 *       400:
 *         description: Some input is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required"
 *       401:
 *         description: The provided token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Token"
 *       403:
 *         description: Token was not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A token is required for authentication"
 *       500:
 *         description: Unexpected error
 */
router.post('/forgot-password', controller.forgotPassword)

/**
 * @swagger
 * /user/reset-password:
 *   put:
 *     description: Use token to change an account's password without the old one
 *     parameters:
 *       - in: header
 *         name: jwt
 *         required: true
 *         description: The JWT token
 *     responseBody:
 *       description: Password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Password was sucessfuly updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update password with success"
 *       400:
 *         description: Some input is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "New password is required"
 *       401:
 *         description: The provided token is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Token"
 *       403:
 *         description: Token was not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A token is required for authentication"
 *       500:
 *         description: Unexpected error
 */
router.post('/reset-password', auth.verifyPasswordResetToken, controller.resetPassword)

export default router
