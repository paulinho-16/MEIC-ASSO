import express from 'express'

import controller from '@/controller/exams-calendar.controller'

const router = express.Router()

/**
 * @swagger
 * /exams-calendar/{courseID}:
 *   get:
 *     summary: Retrieve courseID exams calendar
 *     parameters:
 *       - in: path
 *         name: courseID
 *         required: true
 *         description: course ID
 *     responses:
 *       200:
 *         description: The request was made with a valid course ID
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
 *                             acronym: 
 *                               type: string
 *                             url: 
 *                               type: string
 *                             day: 
 *                               type: string
 *                             begin:
 *                               type: string
 *                             duration:
 *                               type: string
 *                             rooms:
 *                               type: string
 *               example:
 *                 course: "M.EIC"
 *                 seasons:
 *                   - name: "Normal - Época Normal (2ºS)"
 *                     exams:
 *                       - acronym: "SSI"
 *                         url: "https://sigarra.up.pt/feup/pt/exa_geral.exame_view?p_exa_id=54340"
 *                         day: '2022-06-20'
 *                         begin: '14:30'
 *                         duration: '02:00'
 *                         rooms: "B220"
 *                       - acronym: "MFS"
 *                         url: "https://sigarra.up.pt/feup/pt/exa_geral.exame_view?p_exa_id=54395"
 *                         day: '2022-06-20'
 *                         begin: '14:30'
 *                         duration: '02:00'
 *                         rooms: "B301"
 *                   - name: "Recurso - Época Recurso (2ºS)"
 *                     exams:
 *                       - acronym: "SSI"
 *                         url: "https://sigarra.up.pt/feup/pt/exa_geral.exame_view?p_exa_id=54352"
 *                         day: '2022-07-04'
 *                         begin: '14:30'
 *                         duration: '02:00'
 *                         rooms: "B225"
 *                       - acronym: "MFS"
 *                         url: "https://sigarra.up.pt/feup/pt/exa_geral.exame_view?p_exa_id=54396"
 *                         day: '2022-07-04'
 *                         begin: '14:30'
 *                         duration: '02:00'
 *                         rooms: "B205"
 *       500:
 *         description: Unexpected error
*/

router.get('/:id', controller.get)

export default router