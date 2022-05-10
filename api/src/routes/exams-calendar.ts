import express from 'express'

import controller from '@/controller/exams-calendar.controller'

const router = express.Router()

router.get('/:id', controller.getExamsCalendar)

export default router