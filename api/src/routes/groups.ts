import express from 'express'

import controller from '@/controller/groups.controller'

const router = express.Router()

router.get('/', controller.getGroups)

export default router