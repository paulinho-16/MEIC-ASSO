import express from 'express'

import controller from '@/controller/authentication.controller'

const router = express.Router()

router.post('/', controller.postAuthentication)

export default router