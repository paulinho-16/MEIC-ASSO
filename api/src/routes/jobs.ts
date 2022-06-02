import express from 'express'

import controller from '../controller/jobs.controller'

const router = express.Router()

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get jobs
 *     parameters:
 *     responses:
 *       200:
 *         description: The request was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://sigarra.up.pt/feup/pt/noticias_geral.ver_noticia?p_nr=133870"
 *                 title:
 *                    type: string
 *                    example: "FEUP  |Bolsa de Investigação  |FERROVIA 4.0-PPS2-Civil"
 *                 descriptionEN:
 *                    type: string
 *                    example: "Call open for applications for a research grant within..."
 *                 noticeEN:
 *                    type: string
 *                    example: "https://sigarra.up.pt/feup/pt/noticias_geral.noticias_cont?p_id=F350553446/Notice.pdf"
 *                 descriptionPT:
 *                    type: string
 *                    example: "Encontra-se aberto concurso para a atribuição de uma Bolsa de Investigação..."
 *                 noticePT:
 *                    type: string
 *                    example: "https://sigarra.up.pt/feup/pt/noticias_geral.noticias_cont?p_id=F-917607195/Edital.pdf"
 *                 startDate:
 *                    type: string
 *                    example: "24-05-2022"
 *                 endDate:
 *                    type: string
 *                    example: "06-06-2022"
 *       500:
 *         description: "Problem fetching data from SIGARRA"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot fetch SIGARRA jobs page!"
 */
router.get('/', controller.get)

export default router
