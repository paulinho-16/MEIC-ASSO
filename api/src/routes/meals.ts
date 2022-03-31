import express from 'express'

import controller from '@/controller/meals.controller'

const router = express.Router()

router.get('/canteen', controller.getCanteen)

export default router
