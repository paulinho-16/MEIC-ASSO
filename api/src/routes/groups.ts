import express from 'express'

import controller from '@/controller/groups.controller'


const router = express.Router()

router.use(express.json())



// Groups endpoints.

router.get('/', controller.getGroups)

router.get('/:id', controller.getGroup)

router.post('/', controller.createGroup)

router.delete('/:id', controller.deleteGroup)

<<<<<<< HEAD
// Group admin endpoints

router.get('/:id/admins', controller.getGroupAdmins)
router.post('/:id/admins/:userId', controller.addGroupAdmin)
router.delete('/:id/admins/:userId', controller.deleteGroupAdmin)
=======
router.get('/myGroups/:userId', controller.getMyGroups);
>>>>>>> b1e485f11f4c888b78e410d1caac5b8cb50f9ff7

router.patch('/:id',controller.editGroup);


// Members endpoints.

router.get('/:id/members', controller.getGroupMembers)

router.get('/:id/members/:userId', controller.getGroupMember)

router.post('/:id/members/:userId', controller.createGroupMember)

router.delete('/:id/members/:userId', controller.deleteGroupMember)


export default router