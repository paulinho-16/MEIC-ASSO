import express from 'express'

import controller from '../controller/feedback.controller'

const router = express.Router()

//router.get('/', controller.get)


/**
 * @swagger
 * /feedback/meal:
 *     post:
 *       tags:
 *         - feedback
 *       summary: Creates a new meal review
 *       responses:
 *         '200':
 *           description: Meal review added
 *         '400':
 *           description: Bad request
 *         '500':
 *           description: Internal error
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - description
 *                 - author
 *                 - date
 *                 - restaurant
 *                 - dish
 *                 - rating
 *               properties:
 *                 description:
 *                   type: string
 *                   example: "Muito bom!"
 *                 author:
 *                   type: string
 *                   example: "João"
 *                 date:
 *                   type: string
 *                   example: "2022-04-22T00:00:00.000Z"
 *                 restaurant:
 *                   type: string
 *                   example: "Cantina"
 *                 dish:
 *                   type: string
 *                   example: "Carne"
 *                 rating:
 *                   type: integer
 *                   example: 5
 *         description: Meal review object that needs to be added
 *         required: true
*/
router.post('/meal', controller.postMealReview)

/**
 * @swagger
 * /feedback/teacher:
 *     post:
 *       tags:
 *         - feedback
 *       summary: Creates a new teacher review
 *       responses:
 *         '200':
 *           description: Teacher review added
 *         '400':
 *           description: Bad request
 *         '500':
 *           description: Internal error
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - description
 *                 - author
 *                 - date
 *                 - class
 *                 - teacher
 *               properties:
 *                 description:
 *                   type: string
 *                   example: "Muito bom!"
 *                 author:
 *                   type: string
 *                   example: "João"
 *                 date:
 *                   type: string
 *                   example: "2022-04-22T00:00:00.000Z"
 *                 class:
 *                   type: string
 *                   example: "ASSO"
 *                 teacher:
 *                   type: string
 *                   example: "Ademar"
 *         description: Teacher review object that needs to be added
 *         required: true
*/
router.post('/teacher', controller.postTeacherReview)

/**
 * @swagger
 * /feedback/meal:
 *     get:
 *       tags:
 *         - feedback
 *       summary: Returns a meal's review
 *       description: Obtain the meals' review, all the parameters are required even if their value is empty
 *       parameters:
 *         - name: description
 *           in: query
 *           description: Description of the review. If empty it will consider every description.
 *           required: true
 *           schema:
 *             type: string
 *         - name: author
 *           in: query
 *           description: Author of the review. If empty it will consider every author.
 *           required: true
 *           schema:
 *             type: string
 *         - name: date
 *           in: query
 *           description: Date of the review. If empty it will consider every date.
 *           required: true
 *           schema:
 *             type: string
 *         - name: restaurant
 *           in: query
 *           description: Restaurant of the review. If empty it will consider every restaurant.
 *           required: true
 *           schema:
 *             type: string
 *         - name: dish
 *           in: query
 *           description: Dish of the review. If empty it will consider every dish.
 *           required: true
 *           schema:
 *             type: string
 *         - name: rating
 *           in: query
 *           description: Rating of the review. If empty it will consider every rating. Value of rating => [0,5].
 *           required: true
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                     type: object
 *                     required:
 *                       - description
 *                       - author
 *                       - date
 *                       - restaurant
 *                       - dish
 *                       - rating
 *                     properties:
 *                       description:
 *                         type: string
 *                         example: "Muito bom!"
 *                       author:
 *                         type: string
 *                         example: "João"
 *                       date:
 *                         type: string
 *                         example: "2022-04-22T00:00:00.000Z"
 *                       restaurant:
 *                         type: string
 *                         example: "Cantina"
 *                       dish:
 *                         type: string
 *                         example: "Carne"
 *                       rating:
 *                         type: integer
 *                         example: 5
 *         '400':
 *           description: Invalid status value
 *         '500':
 *           description: Internal error
*/
router.get('/meal', controller.getMealReview)

/**
 * @swagger
 *   /feedback/teacher:
 *     get:
 *       tags:
 *         - feedback
 *       summary: Returns a teacher's review
 *       description: Obtain the teacher' review, all the parameters are required even if their value is empty
 *       parameters:
 *         - name: description
 *           in: query
 *           description: Description of the review. If empty it will consider every description.
 *           required: true
 *           schema:
 *             type: string
 *         - name: author
 *           in: query
 *           description: Author of the review. If empty it will consider every author.
 *           required: true
 *           schema:
 *             type: string
 *         - name: date
 *           in: query
 *           description: Date of the review. If empty it will consider every date.
 *           required: true
 *           schema:
 *             type: string
 *         - name: class
 *           in: query
 *           description: Class of the review. If empty it will consider every class.
 *           required: true
 *           schema:
 *             type: string
 *         - name: teacher
 *           in: query
 *           description: Teacher of the review. If empty it will consider every teacher.
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - description
 *                     - author
 *                     - date
 *                     - class
 *                     - teacher
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: "Muito bom!"
 *                     author:
 *                       type: string
 *                       example: "João"
 *                     date:
 *                       type: string
 *                       example: "2022-04-22T00:00:00.000Z"
 *                     class:
 *                       type: string
 *                       example: "ASSO"
 *                     teacher:
 *                       type: string
 *                       example: "Ademar"
 *         '400':
 *           description: Invalid status value
 *         '500':
 *           description: Internal error
*/
router.get('/teacher', controller.getTeacherReview)


export default router
