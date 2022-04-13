import express from 'express'

import controller from '../controller/news.controller'

const router = express.Router()

router.get('/', controller.get)

export default router
