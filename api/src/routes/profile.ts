import express from 'express'

import controller from '@/controller/profile.controller'

import constants from '@/config/constants'

const router = express.Router()

/**
 * @swagger
 * /profile/{studentNumber}:
 *   get:
 *     summary: Retrieve studentNumber profile
 *     tags:
 *       - Profile
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

/**
 * @swagger
 * /profile/{studentNumber}/url:
 *   get:
 *     summary: Fetch URL necessary to retrieve studentNumber profile
 *     tags:
 *       - Profile
 *     parameters:
 *       - in: path
 *         name: studentNumber
 *         required: true
 *         description: student number
 *     responses:
 *       200:
 *         description: The URL necessary to retrieve studentNumber profile
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example:
 *               https://sigarra.up.pt/feup/pt/fest_geral.info_pessoal_completa_view?pv_num_unico=201800000
 *       500:
 *         description: Unexpected error
 */
router.route('/:studentNumber/url')
  .get(function (req, res) {
    res.status(200).send(`https://sigarra.up.pt/feup/pt/fest_geral.info_pessoal_completa_view?pv_num_unico=` + req.params.studentNumber);
  });

export default router
