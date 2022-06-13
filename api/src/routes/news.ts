import express from 'express'

import controller from '@/controller/news.controller'

const router = express.Router()

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Fetch news about FEUP and its environment
 *     parameters:
 *     responses:
 *       200:
 *         description: The news about FEUP and its environment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                  url:
 *                    type: string
 *                  title:
 *                    type: string
 *                  excerpt:
 *                    type: string
 *                  header:
 *                    type: string
 *                  details:
 *                    type: string
 *                  content:
 *                    type: string
 *               example:
 *                - url: https://sigarra.up.pt/feup/pt/noticias_geral.ver_noticia?p_nr=133750
 *                  title: "Provas de Doutoramento: ..."
 *                  excerpt: "Requeridas por: Rodrigo Esmeriz Falcão Moreira Data ..."
 *                  header: "Notícias Provas de Doutoramento ..."
 *                  details: "Provas de Doutoramento em Engenharia Civil ..."
 *                  content: "Requeridas por:Rodrigo Esmeriz Falcão MoreiraData, Hora e Local27 de maio ..."
 *                - url: https://sigarra.up.pt/feup/pt/noticias_geral.ver_noticia?p_nr=133770
 *                  title: "Kaizen Challenge 2022"
 *                  excerpt: "Se és estudante de engenharia, junta-te ao Kaizen Institute no próximo ..."
 *                  header: "Kaizen Challenge 2022 ..."
 *                  details: "27 de maio ..."
 *                  content: "Se és estudante de engenharia, junta-te ao Kaizen Institute no próximo"
 *       500:
 *         description: Unexpected error
 */
router.get('/', controller.get)

/**
 * @swagger
 * /news/url:
 *   get:
 *     summary: Fetch URL news about FEUP and its environment
 *     parameters:
 *     responses:
 *       200:
 *         description: The URL necessary to retrieve news about FEUP and its environment
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               https://sigarra.up.pt/feup/pt/noticias_geral.lista_noticias
 *       500:
 *         description: Unexpected error
 */
router.route('/url')
    .get(function (req, res) {
        res.status(200).send(`https://sigarra.up.pt/feup/pt/noticias_geral.lista_noticias`);
    });

export default router
