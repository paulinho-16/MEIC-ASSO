import express from 'express'

import controller from '@/controller/schedule.controller'

const router = express.Router()

router.get('/student', controller.getStudentSchedule)

export default router
