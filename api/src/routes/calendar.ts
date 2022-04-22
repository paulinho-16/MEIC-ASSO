import express from 'express'

import controller from '@/controller/calendar.controller'

const router = express.Router()

router.get('/', controller.getCalendarEvents)
router.get('/create', controller.addCalendarEvent)

export default router
