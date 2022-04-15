import express from 'express'

import controller from '@/controller/associations.controller'

const router = express.Router()

router.get('/', controller.getAssociations)

export default router
