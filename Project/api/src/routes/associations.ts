import express from 'express'

import controller from '@/controller/associations.controller'

import constants from '@/config/constants'

const router = express.Router()

/**
 * @swagger
 * /associations:
 *   get:
 *     summary: Fetch information about the student associations
 *     tags:
 *       - Associations
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

/**
 * @swagger
 * /associations/url:
 *   get:
 *     summary: Fetch URL necessary to retrieve information about the student associations
 *     tags:
 *       - Associations
 *     parameters:
 *     responses:
 *       200:
 *         description: The URL necessary to retrieve information about the student associations
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               https://paginas.fe.up.pt/~estudar/vida-na-feup/associacoes-de-estudantes/
 *       500:
 *         description: Unexpected error
 */
router.route('/url')
  .get(function (req, res) {
    res.status(200).send(`${constants.associationsUrl}`);
  });

export default router
