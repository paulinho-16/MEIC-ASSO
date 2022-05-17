import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/user.controller'

const router = express.Router()

router.put('/update-password/:id', auth.verifyAuthorization, controller.updatePassword)
router.delete('/:id', auth.verifyAuthorization, controller.deleteUser)
router.post('/forgot-password', controller.forgotPassword)
router.post('/reset-password', auth.verifyPasswordResetToken, controller.resetPassword)

export default router
