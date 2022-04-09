import express from 'express'

import controller from '../controller/status.controller'

const router = express.Router()

router.get('/', controller.get)

export default router
