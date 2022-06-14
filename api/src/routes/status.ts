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
*/
router.get('/', controller.get)

export default router
