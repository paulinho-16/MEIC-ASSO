import express from 'express'

import controller from '@/controller/groups.controller'


const router = express.Router()

router.use(express.json())

// Groups endpoints.

router.get('/', controller.getGroups)

router.get('/:id', controller.getGroup)

router.post('/', controller.createGroup)

router.delete('/:id', controller.deleteGroup)




// Members endpoints.

router.get('/:id/members', controller.getGroupMembers)

router.get('/:id/members/:userId', controller.getGroupMember)

router.post('/:id/members/:userId', controller.createGroupMember)

router.delete('/:id/members/:userId', controller.deleteGroupMember)


export default router