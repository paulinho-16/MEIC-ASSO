import express from 'express'

import controller from '@/controller/student-exams.controller'

import constants from '@/config/constants'

const router = express.Router()

/**
 * @swagger
 * /student-exams/{studentNumber}:
 *   get:
 *     summary: Fetch all information about the exams of a given student
 *     parameters:
 *       - in: path
 *         name: studentNumber
 *         required: true
 *         type: string
 *         description: Student number
 *     responses:
 *       200:
 *         description: The information about the exams of the given student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentName:
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
 *                             curricularUnit:
 *                               type: string
 *                             day:
 *                               type: string
 *                             date:
 *                               type: string
 *                             beginHour:
 *                               type: string
 *                             endHour:
 *                               type: string
 *                             rooms:
 *                               type: string
 *               example:
 *                 studentName: Nome do Aluno
 *                 seasons:
 *                   - name: Normal - Época Normal (2ºS)
 *                     exams:
 *                       - curricularUnit: Segurança em Sistemas Informáticos
 *                         day: Segunda-Feira
 *                         date: '2022-06-20'
 *                         beginHour: '14:30'
 *                         endHour: '16:30'
 *                         rooms: B220
 *                       - curricularUnit: Gestão de Empresas e Empreendedorismo
 *                         day: Quinta-Feira
 *                         date: '2022-06-23'
 *                         beginHour: '14:30'
 *                         endHour: '16:30'
 *                         rooms: B227A, B225
 *
 *       500:
 *         description: Unexpected error
*/
router.get('/:studentNumber', controller.getStudentExams)

/**
 * @swagger
 * /student-exams/{studentNumber}/url:
 *   get:
 *     summary: Fetch URL necessary to retrieve curricular unit information
 *     parameters:
 *     responses:
 *       200:
 *         description: The URL necessary to retrieve curricular unit information
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               https://sigarra.up.pt/feup/pt/exa_geral.mapa_de_exames?pv_estud_num=201801234
 *       500:
 *         description: Unexpected error
 */
 router.route('/:id/url')
 .get(function (req, res) {
     res.status(200).send(`${constants.studentExamsUrl}${req.params.id}`);
 });

export default router
