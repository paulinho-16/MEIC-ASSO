import express from 'express'
import controller from '@/controller/chat.controller'

const router = express.Router()

router.get('/location', controller.location)
router.get('/:group/message', controller.groupMessage)
router.get('/message', controller.message)

router.get('/groups', controller.getGroups)
export default router
