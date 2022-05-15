import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/user.controller'

const router = express.Router()

router.post('/', controller.register)
router.put('/update-password/:id', auth.verifyAuthorization, controller.updatePassword)
router.delete('/:id', auth.verifyAuthorization, controller.deleteUser)
router.post('/forgotPassword', controller.forgotPassword)
router.post('/resetPassword/:token', auth.verifyPasswordResetToken, controller.resetPassword)

export default router
