import express from 'express'

import controller from '@/controller/calendar.controller'
import auth from '@/middleware/auth'


const router = express.Router()

router.get('/', auth.verifySessionToken, controller.getCalendarEvents)
router.post('/create', auth.verifySessionToken, controller.addCalendarEvent)

export default router
