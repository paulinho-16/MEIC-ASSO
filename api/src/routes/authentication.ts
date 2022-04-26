import express from 'express'
import auth from '@/middleware/auth'

import controller from '@/controller/authentication.controller'

const router = express.Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/', auth, controller.testAuth)

export default router