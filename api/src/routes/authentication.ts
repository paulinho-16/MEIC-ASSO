import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/authentication.controller'

const router = express.Router()

router.get('/', auth.verifySessionToken, controller.testAuth)
router.post('/login', controller.login)
router.post('/logout', auth.verifySessionToken, controller.logout)

export default router
