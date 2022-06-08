import express from 'express'

import controller from '@/controller/associations.controller'

const router = express.Router()

/**
 * @swagger
 * /associations:
 *   get:
 *     summary: Fetch information about the student associations
 *     parameters:
 *     responses:
 *       200:
 *         description: The student associations' information 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                  url:
 *                    type: string
 *                  name:
 *                    type: string
 *                  information:
 *                    type: object
 *                    properties:
 *                      timetable:
 *                        type: string
 *                      phone:
 *                        type: string
 *                      email:
 *                        type: string
 *                      website:
 *                        type: string
 *                      facebook:
 *                        type: string
 *                      instagram:
 *                        type: string
 *               example:
 *                - name: AEFEUP - Associação de Estudantes da FEUP
 *                  information:
 *                    timetable: "09h30–12h00/14h00–17h30"
 *                    phone: "+351225081557"
 *                    email: "geral@aefeup.pt"
 *                    website: "http://www.aefeup.pt/"
 *                - name: InterUP - Associação para Estudantes Internacionais da U.Porto
 *                  information:
 *                    facebook: "www.facebook.com/InterUp.Porto/"
 *                    instagram: "interup.porto"
 *       500:
 *         description: Unexpected error
 */
router.get('/', controller.getAssociations)

export default router
