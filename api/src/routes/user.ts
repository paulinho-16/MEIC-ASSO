import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/user.controller'

const router = express.Router()

router.put('/updatePassword/:id', auth.verifyAuthorization, controller.updatePassword)
router.delete('/delete/:id', auth.verifyAuthorization, controller.deleteUser)

export default router