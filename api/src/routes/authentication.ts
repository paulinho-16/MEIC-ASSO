import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/authentication.controller'

const router = express.Router()

/**
 * @swagger
 * /authentication:
 *   get:
 *     summary: Test the authentication
 *     tags:
 *       - Authentication
 *     security:
 *     - jwt: []
 *     - cookieAuth: []
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
 *       500:
 *         description: Unexpected error
*/
router.get('/', auth.verifySessionToken, controller.testAuth)

/**
 * @swagger
 * /authentication/register:
 *   post:
 *     description: Create an account
 *     tags:
 *       - Authentication
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
 *       201:
 *         description: Created an account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account created successfully"
 *       400:
 *         description: One of the parameters is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The email is not valid"
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The user already exists. Please login."
 *       500:
 *         description: Unexpected error
 */
router.post('/register', controller.register)

/**
 * @swagger
 * /authentication/login:
 *   post:
 *     summary: Perform login
 *     tags:
 *       - Authentication
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
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
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
 *       500:
 *         description: Unexpected error
 */
router.post('/login', controller.login)

/**
 * @swagger
 * /authentication/logout:
 *   post:
 *     summary: Perform logout, deletes the user cookie
 *     tags:
 *       - Authentication
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
 *       500:
 *         description: Unexpected error
 */
router.post('/logout', auth.verifySessionToken, controller.logout)

export default router
