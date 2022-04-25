import express from 'express'

import controller from '@/controller/groups.controller'


const router = express.Router()

router.use(express.json())

router.get('/', controller.getGroups)

router.get('/:id', controller.getGroup)

router.post('/', controller.createGroup)

router.delete('/:id', controller.deleteGroup)

export default router