import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/authentication.controller'

const router = express.Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/logout',  auth.verifySessionToken, controller.logout)
router.post('/forgotPassword', controller.forgotPassword)
router.post('/resetPassword/:token', auth.verifyPasswordResetToken, controller.resetPassword)
router.post('/',  auth.verifySessionToken, controller.testAuth)

export default router