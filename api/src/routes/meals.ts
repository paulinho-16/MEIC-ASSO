import express from 'express'

import controller from '@/controller/meals.controller'

const router = express.Router()

router.get('/canteen', controller.getCanteen)
router.get('/grill', controller.getGrill)
router.get('/cafeteria', controller.getCafeteria)
router.get('/inegi', controller.getInegi)
router.get('/inesc', controller.getInesc)

export default router
