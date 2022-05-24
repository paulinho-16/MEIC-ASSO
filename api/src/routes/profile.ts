import express from 'express'

import controller from '@/controller/profile.controller'

const router = express.Router()

router.get('/:studentNumber', controller.get)
/**
 * @swagger
 * /profile/{studentNumber}:
 *   get:
 *     description: Retrieve studentNumber profile
 *     parameters:
 *       - in: path
 *         name: studentNumber
 *         required: true
 *         description: student number
 *     responseBody:
 *       description: Response
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sex:
 *                 type: string
 *               birthday:
 *                 type: string
 *               nationality:
 *                 type: string
 *               number:
 *                 type: integer
 *               email:
 *                 type: string
 */

export default router