import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/authentication.controller'

const router = express.Router()

/**
 * @swagger
 * /authentication:
 *   get:
 *     summary: Test the authentication
 *     parameters:
 *       - in: header
 *         name: jwt
 *         required: true
 *         type: string
 *         description: The JWT token
 *     responses:
 *       200:
 *         description: The request was made with a valid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "1"
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
 *       406:
 *         description: The user associated with the token does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The user does not exist"
*/
router.get('/', auth.verifySessionToken, controller.testAuth)

/**
 * @swagger
 *
 */
router.post('/register', controller.register)

/**
 * @swagger
 * /authentication/login:
 *   post:
 *     summary: Perform login
 *     requestBody:
 *       description: Login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "example@email.com"
 *               password:
 *                 type: string
 *                 example: "password"
 *     responses:
 *       200:
 *         description: The user was logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login with success"
 *                 id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 */
router.post('/login', controller.login)

/**
 * @swagger
 * /authentication/logout:
 *   post:
 *     summary: Perform logout, deletes the user cookie
 *     requestBody:
 *       description: Doesn't have one
 *       required: False
 *       content: None
 *     responses:
 *       200:
 *         description: The user logged out successfully created
 *       400:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
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
 *       406:
 *         description: The user associated with the token does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The user does not exist"
 */
router.post('/logout', auth.verifySessionToken, controller.logout)

export default router
