import express from 'express'

import controller from '@/controller/groups.controller'


const router = express.Router()

router.use(express.json())

router.use(express.json())

router.get('/', controller.getGroups)

router.post('/', controller.createGroup)

export default router