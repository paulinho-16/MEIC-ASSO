import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/authentication.controller'

const router = express.Router()

router.get('/', auth.verifyToken, controller.testAuth)
router.post('/', controller.register)
router.post('/login', controller.login)
router.post('/logout', auth.verifyToken, controller.logout)

export default router
