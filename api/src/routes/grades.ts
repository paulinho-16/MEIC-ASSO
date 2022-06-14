import express from 'express'

import controller from '@/controller/grades.controller'

import constants from '@/config/constants'

const router = express.Router()

/**
 * @swagger
 * /grades/{studentNumber}:
 *   get:
 *     summary: Fetch grades for student with studentNumber
 *     parameters:
 *       - in: path
 *         name: studentNumber
 *         required: true
 *         description: Student ID
 *     responses:
 *       200:
 *         description: The grades for every course the student has been enrolled in
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   major: 
 *                     type: string
 *                   grades:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         uc: 
 *                           type: string
 *                         year: 
 *                           type: number
 *                         code: 
 *                           type: string
 *                         result: 
 *                           type: number
 *                         credits: 
 *                           type: number
 *                         acronym: 
 *                           type: string
 *                         semester: 
 *                           type: number
 *               example:
 *                 - major: Mestrado em Engenharia Informática e Computação
 *                   grades:
 *                     - uc: Fundamentos da Programação
 *                       year: 1
 *                       code: EIC0005
 *                       result: 20
 *                       credits: 6
 *                       acronym: FPRO
 *                       semester: 1
 *                     - uc: Métodos Estatísticos
 *                       year: 1
 *                       code: EIC0105
 *                       result: 20
 *                       credits: 4.5
 *                       acronym: MEST
 *                       semester: 2
 *                     - uc: Bases de Dados
 *                       year: 2
 *                       code: EIC0023
 *                       result: 20
 *                       credits: 6
 *                       acronym: BDAD
 *                       semester: 2
 *                     - uc: Proficiência Pessoal e Interpessoal
 *                       year: 3
 *                       code: EIC0031
 *                       result: 20
 *                       credits: 4.5
 *                       acronym: PPIN
 *                       semester: 2
 *                     - uc: Sistemas de Informação
 *                       year: 4
 *                       code: EIC0040
 *                       result: 20
 *                       credits: 6
 *                       acronym: SINF
 *                       semester: 1
 *                     - uc: Gestão de Empresas
 *                 - major: Mestrado Integrado em Engenharia Electrotécnica e de Computadores
 *                   grades:
 *                     - uc: Gestão de Empresas
 *                       year: 4
 *                       code: EIC0034
 *                       result: 20
 *                       credits: 4.5
 *                       acronym: GEMP
 *                       semester: 1
 *                     - uc: Agentes e Inteligência Artificial Distribuída
 *                       year: 4
 *                       code: EIC0033
 *                       result: 20
 *                       credits: 6
 *                       acronym: AIAD
 *                       semester: 1
 *                 - major: Mestrado Integrado em Engenharia Informática e Computação
 *                   grades:
 *                     - uc: Investigação Operacional
 *                       year: 4
 *                       code: EIC0037
 *                       result: 20
 *                       credits: 4.5
 *                       acronym: IOPE
 *                       semester: 2
 *                     - uc: Engenharia de Requisitos de Sistemas de Software
 *                       year: 4
 *                       code: EIC0053
 *                       result: 20
 *                       credits: 6
 *                       acronym: ERSS
 *                       semester: 2
 *                 - major: Licenciatura em Engenharia Informática e Computação
 *                   grades:
 *                     - uc: Matemática Discreta
 *                       year: 1
 *                       code: EIC0011
 *                       result: 20
 *                       credits: 6
 *                       acronym: MDIS
 *                       semester: 1
 *                     - uc: Arquitectura e Organização de Computadores
 *                       year: 1
 *                       code: EIC0083
 *                       result: 20
 *                       credits: 6
 *                       acronym: AOCO
 *                       semester: 1
 *       500:
 *         description: Unexpected error
 */
router.get('/:studentNumber', controller.get)

/**
 * @swagger
 * /grades/{studentNumber}/url:
 *   get:
 *     summary: Fetch URL necessary to retrieve grades for student with studentNumber
 *     parameters:
 *     responses:
 *       200:
 *         description: The URL necessary to retrieve grades for student with studentNumber
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               https://sigarra.up.pt/feup/fest_geral.cursos_list?pv_num_unico=201800000
 *       500:
 *         description: Unexpected error
 */
 router.route('/:studentNumber/url')
 .get(function (req, res) {
     res.status(200).send(`${constants.studentPageBaseUrl}=` + req.params.studentNumber);
});

export default router
