import express from 'express'

import controller from '@/controller/profile.controller'

const router = express.Router()

/**
 * @swagger
 * /profile/{studentNumber}:
 *   get:
 *     summary: Retrieve studentNumber profile
 *     parameters:
 *       - in: path
 *         name: studentNumber
 *         required: true
 *         description: student number
 *     responses:
 *       200:
 *         description: The request was made with a valid student number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course: 
 *                   type: string
 *                 seasons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name: 
 *                         type: string
 *                       exams:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name: 
 *                               type: string
 *                             gender: 
 *                               type: string
 *                             birthday: 
 *                               type: string
 *                             nationality:
 *                               type: string
 *                             number:
 *                               type: integer
 *                             email:
 *                               type: string
 *               example:
 *                 studentNumber: "upxxxxxxxxx"
 *                 profile:
 *                   - name: "Student Name"
 *                   - gender: "Male"
 *                   - birthday: "27/05/2022"
 *                   - nationality: "Portuguese"
 *                   - number: "911213145"
 *                   - email: "email@email.com"
 *       500:
 *         description: Unexpected error
*/

router.get('/:studentNumber', controller.get)

export default router
