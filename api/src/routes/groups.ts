import express from 'express'

import controller from '@/controller/groups.controller'

const router = express.Router()

router.get('/', controller.getGroups)

router.post('/', controller.createGroup)

export default router