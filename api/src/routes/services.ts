import express from 'express'

import controller from '../controller/services.controller'

const router = express.Router()

router.get('/:id', controller.getServices)

export default router