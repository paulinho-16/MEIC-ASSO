import express from 'express'

import controller from '@/controller/news.controller'

const router = express.Router()

/**
 * @swagger
 * /grades/{studentNumber}:
 * get:
 *   summary: Fetch grades for student with studentNumber
 *   parameters:
 *     - in: path
 *       name: studentNumber
 *       required: true
 *       description: Student ID
 *   responses:
 *     '200':
 *       description: The grades for every course the student has been enrolled in
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentGrades:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     major: string
 *                     grades:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           uc: string
 *                           year: number
 *                           code: string
 *                           result: number
 *                           credits: number
 *                           acronym: string
 *                           semester: number
 *           examples:
 *            - url: https://sigarra.up.pt/feup/pt/noticias_geral.ver_noticia?p_nr=133750
 *              title: "Provas de Doutoramento: ..."
 *              excerpt: "Requeridas por: Rodrigo Esmeriz Falcão Moreira Data ..."
 *              header: "Notícias Provas de Doutoramento ..."
 *              details: "Provas de Doutoramento em Engenharia Civil ..."
 *              content: "Requeridas por:Rodrigo Esmeriz Falcão MoreiraData, Hora e Local27 de maio ..."
 *            - url: https://sigarra.up.pt/feup/pt/noticias_geral.ver_noticia?p_nr=133770
 *              title: "Kaizen Challenge 2022"
 *              excerpt: "Se és estudante de engenharia, junta-te ao Kaizen Institute no próximo ..."
 *              header: "Kaizen Challenge 2022 ..."
 *              details: "27 de maio ..."
 *              content: "Se és estudante de engenharia, junta-te ao Kaizen Institute no próximo"
 *     '500':
 *       description: Unexpected error
 */
router.get('/', controller.get)

export default router
