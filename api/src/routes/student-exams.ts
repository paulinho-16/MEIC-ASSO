import express from 'express'

import controller from '@/controller/student-exams.controller'

const router = express.Router()

router.get('/:studentNumber', controller.getStudentExams)

export default router
