import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/authentication.controller'

const router = express.Router()

/**
 * @swagger
 *   /authentication:
 *     get:
 *       summary: Test the authentication
 *       tags:
 *         - Authentication
 *       security:
 *       - jwt: []
 *       - cookieAuth: []
 *       responses:
 *         200:
 *           description: The request was made with a valid token
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: number
 *               example:
 *                 message: 1
 *         401:
 *           description: Invalid token or session
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
 *                     message: Invalid token
 *                 invalid_session:
 *                   value:
 *                     message: Invalid session
 *                 user_token:
 *                   value:
 *                     message: The user does not exist
 *         403:
 *           description: Token was not provided
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                 message: A token is required for authentication
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
 *                 get_user_failed:
 *                   value:
 *                     message: Get user failed
 *                 session_error:
 *                   value:
 *                     message: Could not process session
*/
router.get('/', auth.verifySessionToken, controller.testAuth)

/**
 * @swagger
 *   /authentication/register:
 *     post:
 *       summary: Create an account
 *       tags:
 *         - Authentication
 *       requestBody:
 *         description: Login credentials
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *             example:
 *               email: example@email.com
 *               password: Password123
 *       responses:
 *         201:
 *           description: Created an account
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                 message: Account created successfully
 *         400:
 *           description: One of the parameters is missing or invalid
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                 message: The email is not valid
 *         409:
 *           description: User already exists
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                 message: The user already exists. Please login.
 *         500:
 *           description: Unexpected error
 */
router.post('/register', controller.register)

/**
 * @swagger
 *   /authentication/login:
 *     post:
 *       summary: Perform login
 *       tags:
 *         - Authentication
 *       requestBody:
 *         description: Login credentials
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *             example:
 *               email: example@email.com
 *               password: Password123
 *       responses:
 *         200:
 *           description: The user was logged in successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   token:
 *                     type: string
 *                   id:
 *                     type: integer
 *               example:
 *                 message: Login with success
 *                 id: 1
 *                 token: eyJhbGciOiJIUzI1NiIbInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY1NTQ2NDMwOCwiZXhwIjoxNjU1NzIzNTA4fQ.Is_sAEggVqkcox_XTZAKia9fsOe_AhSaC655ikEES3E
 *           headers:
 *             Set-Cookie:
 *               schema:
 *                 type: string
 *         400:
 *           description: Inexistent or invalid parameters
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               examples:
 *                 invalid_credentials:
 *                   value:
 *                     message: Invalid credentials
 *                 missing_parameters:
 *                   value:
 *                     message: Email and password are required
 *         401:
 *           description: User does not exist
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                 message: The user does not exist
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
 *                 get_user:
 *                   value:
 *                     message: Get user failed
 *                 session_error:
 *                   value:
 *                     message: Error creating session
 */
router.post('/login', controller.login)

/**
 * @swagger
 *   /authentication/logout:
 *     post:
 *       summary: Perform logout
 *       security:
 *         - jwt: []
 *       tags:
 *         - Authentication
 *       responses:
 *         200:
 *           description: The user was logged out successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                 message: Logout with success
 *         401:
 *           description: The provided token is invalid
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
 *                     message: Get user failed
 *                 invalid_session:
 *                   value:
 *                     message: Error creating session
 *                 user_token:
 *                   value:
 *                     message: The user does not exist
 *         403:
 *           description: Token was not provided
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *               example:
 *                 message: A token is required for authentication
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
 *                 get_user_failed:
 *                   value:
 *                     message: Get user failed
 *                 session_error:
 *                   value:
 *                     message: Could not process session
 */
router.post('/logout', auth.verifySessionToken, controller.logout)

export default router
