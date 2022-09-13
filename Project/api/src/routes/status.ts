import express from 'express'

import controller from '@/controller/status.controller'

const router = express.Router()
// routes/status.ts

/**
 * @swagger
 * /status:
 *  get:
 *    summary: Get server uptime
 *    tags:
 *       - Status
 *    responses:
 *       200:
 *         description: The amount of time it has been up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "I've been up for: XX:XX:XX"
*/
router.get('/', controller.get)

export default router
