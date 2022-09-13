import express from 'express'

import controller from '@/controller/payments.controller'

const router = express.Router()

// routes/payments.ts

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get user payments.
 *     tags:
 *       - Payments
 *     description: Get user payments history.
 *     responses:
 *       200:
 *         description: Payments page information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: Student's UP number.
 *                   example: 202112345
 *                 name:
 *                   type: string
 *                   description: Student's name.
 *                   example: John Doe
 *                 nif:
 *                   type: string
 *                   description: Student's contributor number.
 *                   example: PT 123456789
 *                 balance:
 *                   type: string
 *                   description: Student's account balance.
 *                   example: -69,70 €
 *                 headings:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: Movements table name.
 *                     example: Extrato Geral
 *                 tables:
 *                   type: object
 *                   properties:
 *                     Extrato Geral:
 *                       type: object
 *                       properties:
 *                         headings:
 *                           type: array
 *                           items:
 *                             type: string
 *                             description: Properties for each movement.
 *                             example: Descrição
 *                         movements:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               Descrição:
 *                                 type: string
 *                                 description: Specific property of the movement
 *                                 example: Propinas - Mestrado em Engenharia Informática e Computação
 */
router.get('/', controller.get)

export default router
