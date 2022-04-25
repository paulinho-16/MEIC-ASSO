import express from 'express'

import controller from '../controller/jobs.controller'

const router = express.Router()

router.get('/', controller.get)

export default router
