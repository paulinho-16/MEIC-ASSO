import express from 'express'

import controller from '@/controller/library.controller'

const router = express.Router()

// routes/library.ts

/**
 * @swagger
 * /library:
 *   get:
 *     summary: Get library ocupation.
 *     tags:
 *       - Library
 *     description: Get library current and maximum ocupation for each floor.
 *     responses:
 *       200:
 *         description: A list of floors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   floor:
 *                     type: integer
 *                     description: The floor number.
 *                     example: 1
 *                   max:
 *                     type: integer
 *                     description: The floor maximum ocupation.
 *                     example: 105
 *                   current:
 *                     type: integer
 *                     description: The floor current ocupation.
 *                     example: 12
 */
router.get('/', controller.get)

export default router
