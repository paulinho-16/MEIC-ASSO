import express from 'express'

import controller from '../controller/feedback.controller'

const router = express.Router()

//router.get('/', controller.get)
router.post('/meal', controller.postMealReview)
router.post('/teacher', controller.postTeacherReview)
router.get('/meal', controller.getMealReview)
router.get('/teacher', controller.getTeacherReview)


export default router
