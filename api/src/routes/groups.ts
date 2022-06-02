import express from 'express'
import auth from '@/middleware/auth'

import controller from '../controller/groups.controller'

const router = express.Router()

router.use(express.json())




// GROUP ENDPOINTS.


/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get a list of groups. 
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         type: int
 *         description: Ammount of information to return.
 *       - in: query
 *         name: offset
 *         required: false
 *         type: int
 *         description: Page of information to return.
 *       - in: query
 *         name: classId
 *         required: false
 *         type: int
 *         description: Filter groups by a single class by specifing its ID.
 *     responses:
 *       200:
 *         description: List of groups that matches filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                      id: int
 *                      typename: string
 *                      title: string
 *                      description: string
 *                      mlimit: int
 *                      autoaccept: bool
 *                      classId: int
 *       500:
 *         description: Unexpected error.
*/
router.get('/', controller.getGroups)



/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get information of a single group. 
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: int
 *         description: Id of the group to return.
 *     responses:
 *       200:
 *         description: Group information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                      id: int
 *                      typename: string
 *                      title: string
 *                      description: string
 *                      mlimit: int
 *                      autoaccept: bool
 *                      classId: int
 *       500:
 *         description: Unexpected error.
*/
router.get('/:id', controller.getGroup)


/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Create a new group.
 *     requestBody:
 *       description: Group information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: int
 *                 example: 1
 *               typename:
 *                 type: string
 *                 example: "project"
 *               title:
 *                 type: string
 *                 example: "ASSO Project Group"
 *               description:
 *                 type: string
 *                 example: "Project Group for ASSO class"
 *               mlimit:
 *                 type: int
 *                 example: 5
 *               autoaccept:
 *                 type: bool
 *                 example: true
 *               classId:
 *                 type: int
 *                 example: 1
 *     responses:
 *       200:
 *         description: Group was created with success.
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
 *      
*/
router.post('/',auth.verifySessionToken,controller.createGroup)


/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Delete a group.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: int
 *         description: Id of the group to delete.
 *     responses:
 *       200:
 *         description: Group was deleted with success.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.delete('/:id/:groupId',auth.verifyAuthorization, controller.deleteGroup)


/**
 * @swagger
 * /myGroups/{userId}:
 *   get:
 *     summary: Get list of groups where a specific user is a member of. 
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: int
 *         description: Id of the user from whom to return groups.
 *     responses:
 *       200:
 *         description: List of groups where the given user is a member of.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                      id: int
 *                      typename: string
 *                      title: string
 *                      description: string
 *                      mlimit: int
 *                      autoaccept: bool
 *                      classId: int
 *       500:
 *         description: Unexpected error.
*/
router.get('/myGroups/:id', auth.verifyAuthorization ,controller.getMyGroups)


/**
 * @swagger
 * /groups:
 *   patch:
 *     summary: Edit information on an existing group.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: int
 *         description: Id of the group to edit.
 *     requestBody:
 *       description: Group information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: int
 *                 example: 1
 *               typename:
 *                 type: string
 *                 example: "project"
 *               title:
 *                 type: string
 *                 example: "ASSO Project Group"
 *               description:
 *                 type: string
 *                 example: "Project Group for ASSO class"
 *               mlimit:
 *                 type: int
 *                 example: 5
 *               autoaccept:
 *                 type: bool
 *                 example: true
 *               classId:
 *                 type: int
 *                 example: 1
 *     responses:
 *       200:
 *         description: Group was updated with success.
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
 *      
*/
router.patch('/:id/:groupId',auth.verifyAuthorization,controller.editGroup)








// MEMBERS ENDPOINTS.


/**
 * @swagger
 * /groups/{groupId}/members:
 *   get:
 *     summary: Get a list of group's members. 
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: int
 *         description: Group for which to return its members.
 *       - in: query
 *         name: offset
 *         required: false
 *         type: int
 *         description: Page of information to return.
 *       - in: query
 *         name: limit
 *         required: false
 *         type: int
 *         description: Ammount of groups to return.
 *     responses:
 *       200:
 *         description: List of members of specified group. 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                      id: int
 *                      groupid: int
 *                      studentid: int
 *                      isadmin: bool
 *                      isaccepted: bool
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
*/
router.get('/:id/:groupId/members', auth.verifyAuthorization, controller.getGroupMembers)


/**
 * @swagger
 * /groups/{groupId}/members/{memberId}:
 *   get:
 *     summary: Get information of a single group. 
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: int
 *         description: Id of the group for which member to return.
 *       - in: path
 *         name: memberId
 *         required: true
 *         type: int
 *         description: Id of the member to return.
 *     responses:
 *       200:
 *         description: Member information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  id: int
 *                  groupid: int
 *                  studentid: int
 *                  isadmin: bool
 *                  isaccepted: bool
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
*/
router.get('/:id/:groupId/members/:userId',  auth.verifyAuthorization, controller.getGroupMember)


/**
 * @swagger
 * /groups/{groupId}/members/{memberId}:
 *   post:
 *     summary: Join a group. 
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: int
 *         description: Id of the group for which member to return.
 *       - in: path
 *         name: memberId
 *         required: true
 *         type: int
 *         description: Id of the member to return.
 *     responses:
 *       204:
 *         description: Group join was success.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.post('/:id/:groupId/members/:userId',  auth.verifyAuthorization, controller.createGroupMember)


/**
 * @swagger
 * /groups/{groupId}/members/{memberId}:
 *   delete:
 *     summary: Unjoin a group. 
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: int
 *         description: Id of the group for which member to return.
 *       - in: path
 *         name: memberId
 *         required: true
 *         type: int
 *         description: Id of the member to return.
 *     responses:
 *       204:
 *         description: Group unjoin was success.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.delete('/:id/:groupId/members/:userId', auth.verifyAuthorization, controller.deleteGroupMember)












// ADMIN ENDPOINTS


/**
 * @swagger
 * /groups/{id}/admins:
 *   get:
 *     summary: Get a list of group's admins. 
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         type: int
 *         description: Group for which to return its members.
 *     responses:
 *       200:
 *         description: List of admins of specified group. 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                      id: int
 *                      groupid: int
 *                      studentid: int
 *                      isadmin: bool
 *                      isaccepted: bool
 *       400:
 *         description: Request body is not valid.
 *       500:
 *         description: Unexpected error.
*/
router.get(':id/:groupId/admins', auth.verifyAuthorization, controller.getGroupAdmins)


/**
 * @swagger
 * /groups/{id}/members/{userId}:
 *   post:
 *     summary: Join a group. 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: int
 *         description: Id of the group for which admin to add.
 *       - in: path
 *         name: userId
 *         required: true
 *         type: int
 *         description: Id of the admin to add.
 *     responses:
 *       204:
 *         description: Add admin was successful.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.post(':id/:groupId/admins/:userId', auth.verifyAuthorization,controller.addGroupAdmin)


/**
 * @swagger
 * /groups/{id}/admins/{userId}:
 *   delete:
 *     summary: Remove and admin from a group. 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: int
 *         description: Id of the group for which admin to delete.
 *       - in: path
 *         name: userId
 *         required: true
 *         type: int
 *         description: Id of the admin to delete.
 *     responses:
 *       204:
 *         description: Remove admin was successful.
 *       400:
 *         description: Parameters are not valid.
 *       500:
 *         description: Unexpected error.
*/
router.delete(':id/:groupId/admins/:userId', auth.verifyAuthorization, controller.deleteGroupAdmin)





export default router